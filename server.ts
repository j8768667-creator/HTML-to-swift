import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Lazy initialize Gemini client
  let aiClient: GoogleGenAI | null = null;
  function getAI(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing.");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Health check API
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // AI-powered conversion endpoint for complex/advanced HTML to Swift Playgrounds translation
  app.post("/api/convert-ai", async (req, res) => {
    try {
      const {
        html,
        target = "playgrounds-app", // "playgrounds-app" | "playground-page" | "swiftui-view"
        swiftVersion = "swift6", // "swift6" | "swift5"
        stateDetection = true,
        includeComments = true,
      } = req.body;

      if (!html || typeof html !== "string") {
        return res.status(400).json({ error: "Missing or invalid 'html' in request body" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: "Gemini API key is not configured. Please use the instant offline converter.",
        });
      }

      const ai = getAI();

      const systemPrompt = `You are a world-class Apple platform engineer and SwiftUI expert.
Convert the provided HTML/CSS markup into idiomatic, modern Swift Playgrounds code.

Target Configuration:
- Format: ${
        target === "playgrounds-app"
          ? "Complete Swift Playgrounds 4 App with `@main struct PlaygroundsApp: App` and `ContentView: View`"
          : target === "playground-page"
          ? "Playground Page with `import PlaygroundSupport` and `PlaygroundPage.current.setLiveView(ContentView())`"
          : "Pure SwiftUI View `struct ContentView: View`"
      }
- Swift & Platform version: ${swiftVersion === "swift6" ? "Swift 6, iOS 18+ (use modern `@Observable`, `.glassBackgroundEffect` where suitable, `.tint()`, SF Symbols 5/6)" : "Swift 5.9, iOS 17+ (use `@State`, standard SF symbols)"}
- State bindings: ${stateDetection ? "Generate `@State` variables for inputs (TextField, Toggle, Slider, Picker, etc.) and wire them up with two-way bindings." : "Minimal state"}

Requirements:
1. Output ONLY valid Swift code ready to paste and run directly into Swift Playgrounds on iPad or Mac.
2. Do NOT wrap in markdown backticks or commentary outside the code. The entire response must be strictly pure Swift code.
3. Map web elements intelligently:
   - Form inputs -> TextField, SecureField, Toggle, Picker, Button
   - Flex layouts (row) -> HStack; Flex column / blocks -> VStack; overlapping / absolute -> ZStack
   - Lists / grids -> ScrollView, LazyVGrid, List
   - Web icons -> appropriate Apple SF Symbols (e.g., Image(systemName: "magnifyingglass"))
   - Images -> AsyncImage with loading placeholders
   - Tailwind or CSS styles -> SwiftUI modifiers (.padding, .background, .clipShape(RoundedRectangle), .shadow, .font, .foregroundStyle)
4. Use realistic preview data and preview provider (#Preview or PreviewProvider).`;

      const userPrompt = `Here is the HTML/CSS markup to convert into modern Swift Playgrounds code:\n\n${html}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
        },
      });

      let rawCode = response.text || "";
      // Strip any markdown code fences if model accidentally wrapped
      if (rawCode.startsWith("```swift")) {
        rawCode = rawCode.replace(/^```swift\n?/, "").replace(/\n?```$/, "");
      } else if (rawCode.startsWith("```")) {
        rawCode = rawCode.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");
      }

      return res.json({
        swiftCode: rawCode.trim(),
        modelUsed: "gemini-3.8-flash",
      });
    } catch (err: any) {
      console.error("AI Conversion error:", err);
      return res.status(500).json({
        error: err?.message || "Failed to convert HTML using Gemini AI",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
