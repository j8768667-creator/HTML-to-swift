import { ConversionOptions, ConversionResult, StateVariable, ConversionDiagnostics } from "../types";
import { findSFSymbolForElement } from "./sfSymbolsMap";
import { parseElementStyles, compileModifiersToString } from "./cssToSwiftUI";

interface Context {
  indent: number;
  stateVars: Map<string, StateVariable>;
  varCounter: Record<string, number>;
  diagnostics: ConversionDiagnostics;
  options: ConversionOptions;
}

function sanitizeIdentifier(str: string): string {
  const clean = str
    .replace(/[^a-zA-Z0-9]/g, " ")
    .trim()
    .split(/\s+/)
    .map((word, i) => (i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join("");
  return clean || "item";
}

function getNextVarName(ctx: Context, baseName: string): string {
  const safe = sanitizeIdentifier(baseName);
  const count = ctx.varCounter[safe] || 0;
  ctx.varCounter[safe] = count + 1;
  return count === 0 ? safe : `${safe}${count + 1}`;
}

function escapeSwiftString(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
}

export function convertHtmlToSwiftUI(htmlString: string, options: ConversionOptions): ConversionResult {
  const startTime = performance.now();

  const diagnostics: ConversionDiagnostics = {
    elementsProcessed: 0,
    stateVarsCount: 0,
    depth: 0,
    processingTimeMs: 0,
    warnings: [],
  };

  const ctx: Context = {
    indent: 2,
    stateVars: new Map(),
    varCounter: {},
    diagnostics,
    options,
  };

  if (!htmlString || !htmlString.trim()) {
    return {
      swiftCode: "// Enter HTML on the left to convert into Swift Playgrounds code",
      stateVariables: [],
      diagnostics: {
        ...diagnostics,
        processingTimeMs: Math.round(performance.now() - startTime),
      },
    };
  }

  // Parse HTML via browser DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString.trim(), "text/html");

  // Check parser errors
  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    diagnostics.warnings.push("HTML contained syntax irregularities; parsed via best-effort recovery.");
  }

  // Target body or root element
  const rootElement = doc.body.children.length === 1 ? doc.body.firstElementChild! : doc.body;

  // Convert the DOM tree
  const viewBodyLines = convertNode(rootElement, ctx, 1);
  const bodyContent = viewBodyLines.join("\n");

  const stateVarsArray = Array.from(ctx.stateVars.values());
  diagnostics.stateVarsCount = stateVarsArray.length;

  // Assemble the final Swift Playgrounds code based on target format
  const swiftCode = assembleFullSwiftFile(bodyContent, stateVarsArray, options);

  diagnostics.processingTimeMs = Math.round((performance.now() - startTime) * 10) / 10;

  return {
    swiftCode,
    stateVariables: stateVarsArray,
    diagnostics,
  };
}

function convertNode(node: Node, ctx: Context, currentDepth: number): string[] {
  if (currentDepth > ctx.diagnostics.depth) {
    ctx.diagnostics.depth = currentDepth;
  }

  // Text node
  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent || "").trim();
    if (!text) return [];
    const indent = " ".repeat(ctx.indent * currentDepth);
    return [`${indent}Text("${escapeSwiftString(text)}")`];
  }

  // Element node
  if (node.nodeType === Node.ELEMENT_NODE) {
    ctx.diagnostics.elementsProcessed++;
    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();

    // Skip <script>, <style>, <link>, <meta>
    if (["script", "style", "link", "meta", "title", "head"].includes(tagName)) {
      return [];
    }

    return convertElement(el, ctx, currentDepth);
  }

  return [];
}

function convertElement(el: HTMLElement, ctx: Context, depth: number): string[] {
  const tagName = el.tagName.toLowerCase();
  const indent = " ".repeat(ctx.indent * depth);
  const innerIndent = " ".repeat(ctx.indent * (depth + 1));
  const styleMods = parseElementStyles(el);

  // Check if this is an Icon (SVG or <i> / <span> with icon classes)
  if (ctx.options.mapSFSymbols) {
    const sfSymbol = findSFSymbolForElement(el);
    if (sfSymbol && (tagName === "i" || tagName === "svg" || tagName === "span" || el.classList.contains("icon"))) {
      const iconLines = [`${indent}Image(systemName: "${sfSymbol}")`];
      if (styleMods.foregroundStyle) iconLines.push(`${indent}${styleMods.foregroundStyle}`);
      if (styleMods.fontModifier) iconLines.push(`${indent}${styleMods.fontModifier}`);
      return iconLines;
    }
  }

  // Headings
  if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)) {
    const text = escapeSwiftString(el.textContent?.trim() || "Heading");
    const headingFontMap: Record<string, string> = {
      h1: ".font(.largeTitle).bold()",
      h2: ".font(.title).bold()",
      h3: ".font(.title2).bold()",
      h4: ".font(.title3).fontWeight(.semibold)",
      h5: ".font(.headline)",
      h6: ".font(.subheadline).foregroundStyle(.secondary)",
    };

    const lines = [`${indent}Text("${text}")`];
    if (styleMods.fontModifier) {
      lines.push(`${indent}${styleMods.fontModifier}`);
    } else {
      lines.push(`${indent}${headingFontMap[tagName]}`);
    }
    if (styleMods.fontWeight && !headingFontMap[tagName].includes("bold")) {
      lines.push(`${indent}${styleMods.fontWeight}`);
    }

    const mods = compileModifiersToString(styleMods, true);
    mods.forEach((m) => lines.push(`${indent}${m}`));
    return lines;
  }

  // Paragraph & Span
  if (tagName === "p" || tagName === "span" || tagName === "label" || tagName === "small") {
    // If element only contains text
    if (el.children.length === 0) {
      const text = escapeSwiftString(el.textContent?.trim() || "");
      const lines = [`${indent}Text("${text}")`];
      if (tagName === "small") {
        lines.push(`${indent}.font(.caption)`);
        lines.push(`${indent}.foregroundStyle(.secondary)`);
      } else if (!styleMods.fontModifier) {
        lines.push(`${indent}.font(.body)`);
      }
      const mods = compileModifiersToString(styleMods, true);
      mods.forEach((m) => lines.push(`${indent}${m}`));
      return lines;
    }
    // Has child elements (like <strong>, <i>, <a>, or nested spans)
  }

  // Bold & Italic
  if (tagName === "strong" || tagName === "b") {
    const text = escapeSwiftString(el.textContent?.trim() || "");
    return [`${indent}Text("${text}").bold()`];
  }
  if (tagName === "em" || tagName === "i") {
    const text = escapeSwiftString(el.textContent?.trim() || "");
    return [`${indent}Text("${text}").italic()`];
  }

  // Links
  if (tagName === "a") {
    const href = el.getAttribute("href") || "https://apple.com";
    const text = escapeSwiftString(el.textContent?.trim() || "Link");
    const lines = [`${indent}Link("${text}", destination: URL(string: "${href}")!)`];
    if (styleMods.foregroundStyle) lines.push(`${indent}${styleMods.foregroundStyle}`);
    return lines;
  }

  // Buttons
  if (tagName === "button" || (el.getAttribute("role") === "button")) {
    const buttonText = el.textContent?.trim() || "Action";
    const sfSymbol = ctx.options.mapSFSymbols ? findSFSymbolForElement(el) : null;

    const lines: string[] = [];
    lines.push(`${indent}Button(action: {`);
    lines.push(`${innerIndent}// Action for ${buttonText}`);
    lines.push(`${innerIndent}print("${buttonText} pressed")`);
    lines.push(`${indent}}) {`);

    if (el.children.length > 0) {
      // Child elements
      const childLines: string[] = [];
      Array.from(el.childNodes).forEach((child) => {
        childLines.push(...convertNode(child, ctx, depth + 1));
      });
      if (childLines.length > 0) {
        lines.push(`${innerIndent}HStack(spacing: 8) {`);
        lines.push(...childLines.map((l) => "  " + l));
        lines.push(`${innerIndent}}`);
      } else {
        lines.push(`${innerIndent}Text("${escapeSwiftString(buttonText)}")`);
      }
    } else {
      if (sfSymbol) {
        lines.push(`${innerIndent}HStack(spacing: 6) {`);
        lines.push(`${innerIndent}  Image(systemName: "${sfSymbol}")`);
        lines.push(`${innerIndent}  Text("${escapeSwiftString(buttonText)}")`);
        lines.push(`${innerIndent}}`);
      } else {
        lines.push(`${innerIndent}Text("${escapeSwiftString(buttonText)}")`);
      }
    }

    lines.push(`${indent}}`);

    // Standard button style if not heavily customized
    if (!styleMods.background) {
      lines.push(`${indent}.buttonStyle(.borderedProminent)`);
    } else {
      // Custom styled button
      lines.push(`${indent}.buttonStyle(.plain)`);
    }

    const mods = compileModifiersToString(styleMods);
    mods.forEach((m) => lines.push(`${indent}${m}`));
    return lines;
  }

  // Inputs
  if (tagName === "input") {
    const inputType = (el.getAttribute("type") || "text").toLowerCase();
    const placeholder = escapeSwiftString(el.getAttribute("placeholder") || "Enter text...");
    const nameAttr = el.getAttribute("name") || el.getAttribute("id") || inputType;

    // Checkbox -> Toggle
    if (inputType === "checkbox") {
      const varName = getNextVarName(ctx, nameAttr || "isOn");
      if (ctx.options.autoDetectState) {
        ctx.stateVars.set(varName, {
          name: varName,
          type: "Bool",
          defaultValue: el.hasAttribute("checked") ? "true" : "false",
          sourceElement: "checkbox",
        });
      }
      const label = escapeSwiftString(el.getAttribute("aria-label") || el.getAttribute("title") || "Enable Option");
      const lines = [`${indent}Toggle("${label}", isOn: $${varName})`];
      return lines;
    }

    // Password -> SecureField
    if (inputType === "password") {
      const varName = getNextVarName(ctx, nameAttr || "password");
      if (ctx.options.autoDetectState) {
        ctx.stateVars.set(varName, {
          name: varName,
          type: "String",
          defaultValue: `""`,
          sourceElement: "password",
        });
      }
      const lines = [
        `${indent}SecureField("${placeholder}", text: $${varName})`,
        `${indent}.textFieldStyle(.roundedBorder)`,
      ];
      return lines;
    }

    // Slider / Range -> Slider
    if (inputType === "range") {
      const varName = getNextVarName(ctx, nameAttr || "sliderValue");
      const min = el.getAttribute("min") || "0";
      const max = el.getAttribute("max") || "100";
      if (ctx.options.autoDetectState) {
        ctx.stateVars.set(varName, {
          name: varName,
          type: "Double",
          defaultValue: `${min}.0`,
          sourceElement: "range",
        });
      }
      return [`${indent}Slider(value: $${varName}, in: ${min}...${max})`];
    }

    // Default text field
    const varName = getNextVarName(ctx, nameAttr || "textInput");
    if (ctx.options.autoDetectState) {
      const val = el.getAttribute("value") || "";
      ctx.stateVars.set(varName, {
        name: varName,
        type: "String",
        defaultValue: `"${escapeSwiftString(val)}"`,
        sourceElement: inputType,
      });
    }

    const lines = [
      `${indent}TextField("${placeholder}", text: $${varName})`,
      `${indent}.textFieldStyle(.roundedBorder)`,
    ];
    if (inputType === "email") lines.push(`${indent}.textInputAutocapitalization(.never)`);
    return lines;
  }

  // Textarea -> TextEditor
  if (tagName === "textarea") {
    const placeholder = escapeSwiftString(el.getAttribute("placeholder") || "Enter details...");
    const nameAttr = el.getAttribute("name") || el.getAttribute("id") || "notes";
    const varName = getNextVarName(ctx, nameAttr);

    if (ctx.options.autoDetectState) {
      ctx.stateVars.set(varName, {
        name: varName,
        type: "String",
        defaultValue: `"${escapeSwiftString(el.textContent?.trim() || "")}"`,
        sourceElement: "textarea",
      });
    }

    return [
      `${indent}VStack(alignment: .leading, spacing: 4) {`,
      `${innerIndent}Text("${placeholder}").font(.caption).foregroundStyle(.secondary)`,
      `${innerIndent}TextEditor(text: $${varName})`,
      `${innerIndent}  .frame(minHeight: 100)`,
      `${innerIndent}  .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.gray.opacity(0.3), lineWidth: 1))`,
      `${indent}}`,
    ];
  }

  // Select -> Picker
  if (tagName === "select") {
    const nameAttr = el.getAttribute("name") || el.getAttribute("id") || "selectedOption";
    const varName = getNextVarName(ctx, nameAttr);
    const optionsList: string[] = [];

    Array.from(el.querySelectorAll("option")).forEach((opt) => {
      const optVal = opt.getAttribute("value") || opt.textContent?.trim() || "Option";
      const optText = opt.textContent?.trim() || optVal;
      optionsList.push(`Text("${escapeSwiftString(optText)}").tag("${escapeSwiftString(optVal)}")`);
    });

    const defaultVal = optionsList.length > 0 ? el.querySelector("option")?.getAttribute("value") || "Option" : "Default";

    if (ctx.options.autoDetectState) {
      ctx.stateVars.set(varName, {
        name: varName,
        type: "String",
        defaultValue: `"${escapeSwiftString(defaultVal)}"`,
        sourceElement: "select",
      });
    }

    const lines = [
      `${indent}Picker("Select", selection: $${varName}) {`,
      ...optionsList.map((opt) => `${innerIndent}${opt}`),
      `${indent}}`,
      `${indent}.pickerStyle(.menu)`,
    ];
    return lines;
  }

  // Image -> AsyncImage
  if (tagName === "img") {
    const src = el.getAttribute("src") || "https://picsum.photos/400/300";
    const alt = escapeSwiftString(el.getAttribute("alt") || "Image");
    const width = el.getAttribute("width");
    const height = el.getAttribute("height");

    const lines = [
      `${indent}AsyncImage(url: URL(string: "${src}")) { phase in`,
      `${innerIndent}switch phase {`,
      `${innerIndent}case .empty:`,
      `${innerIndent}  ProgressView()`,
      `${innerIndent}case .success(let image):`,
      `${innerIndent}  image.resizable().scaledToFit()`,
      `${innerIndent}case .failure:`,
      `${innerIndent}  Image(systemName: "photo").foregroundStyle(.secondary)`,
      `${innerIndent}@unknown default:`,
      `${innerIndent}  EmptyView()`,
      `${innerIndent}}`,
      `${indent}}`,
    ];

    if (width || height || styleMods.frame) {
      const frameStr = styleMods.frame || (width && height ? `.frame(width: ${width}, height: ${height})` : width ? `.frame(width: ${width})` : `.frame(height: ${height})`);
      lines.push(`${indent}${frameStr}`);
    } else {
      lines.push(`${indent}.frame(maxHeight: 220)`);
    }

    if (styleMods.clipShape) {
      lines.push(`${indent}${styleMods.clipShape}`);
    } else {
      lines.push(`${indent}.clipShape(RoundedRectangle(cornerRadius: 12))`);
    }

    return lines;
  }

  // Lists <ul> and <ol>
  if (tagName === "ul" || tagName === "ol") {
    const isOrdered = tagName === "ol";
    const items = Array.from(el.children).filter((c) => c.tagName.toLowerCase() === "li");
    const lines = [`${indent}VStack(alignment: .leading, spacing: 10) {`];

    items.forEach((item, idx) => {
      const itemText = escapeSwiftString(item.textContent?.trim() || "");
      lines.push(`${innerIndent}HStack(alignment: .top, spacing: 8) {`);
      if (isOrdered) {
        lines.push(`${innerIndent}  Text("${idx + 1}.").bold().foregroundStyle(.secondary)`);
      } else {
        lines.push(`${innerIndent}  Image(systemName: "circle.fill").font(.system(size: 6)).padding(.top, 6)`);
      }
      lines.push(`${innerIndent}  Text("${itemText}")`);
      lines.push(`${innerIndent}}`);
    });

    lines.push(`${indent}}`);
    return lines;
  }

  // Divider <hr>
  if (tagName === "hr") {
    return [`${indent}Divider()`];
  }

  // Form <form>
  if (tagName === "form") {
    const childLines: string[] = [];
    Array.from(el.childNodes).forEach((child) => {
      childLines.push(...convertNode(child, ctx, depth + 1));
    });

    return [
      `${indent}Form {`,
      `${innerIndent}Section {`,
      ...childLines.map((l) => "  " + l),
      `${innerIndent}}`,
      `${indent}}`,
    ];
  }

  // Container elements: <div>, <section>, <header>, <footer>, <main>, <nav>, <article>, <aside>
  // Determine layout container: HStack vs VStack vs ZStack vs LazyVGrid
  const isRow = styleMods.isFlexRow && !styleMods.isFlexCol;
  const isGrid = styleMods.isGrid;
  const spacingParam = styleMods.spacing !== undefined ? `spacing: ${styleMods.spacing}` : "";

  let containerOpen = "";
  if (isGrid) {
    containerOpen = `LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: ${styleMods.spacing || 12}) {`;
  } else if (isRow) {
    const alignment = styleMods.layoutAlignment ? `alignment: .${styleMods.layoutAlignment}, ` : "";
    containerOpen = `HStack(${alignment}${spacingParam}) {`.replace("()", "").replace("(, ", "(");
  } else {
    // Default vertical stack
    const alignment = "alignment: .leading";
    containerOpen = `VStack(${alignment}${spacingParam ? ", " + spacingParam : ""}) {`;
  }

  // Convert all child nodes
  const childLines: string[] = [];
  Array.from(el.childNodes).forEach((child) => {
    childLines.push(...convertNode(child, ctx, depth + 1));
  });

  // If container has no children, render Color.clear or comment
  if (childLines.length === 0) {
    const text = el.textContent?.trim();
    if (text) {
      return [`${indent}Text("${escapeSwiftString(text)}")`];
    }
    return [];
  }

  const lines = [
    `${indent}${containerOpen}`,
    ...childLines,
    `${indent}}`,
  ];

  const mods = compileModifiersToString(styleMods);
  mods.forEach((m) => lines.push(`${indent}${m}`));

  return lines;
}

function assembleFullSwiftFile(bodyContent: string, stateVars: StateVariable[], options: ConversionOptions): string {
  const indent = " ".repeat(options.indentSize);

  // State declarations
  let stateDeclarations = "";
  if (stateVars.length > 0) {
    stateDeclarations = stateVars
      .map((v) => `${indent}@State private var ${v.name}: ${v.type} = ${v.defaultValue}`)
      .join("\n") + "\n";
  }

  let finalBody = bodyContent;
  if (options.wrapInScrollView) {
    const innerIndented = bodyContent
      .split("\n")
      .map((line) => (line.trim() ? `${indent}${line}` : line))
      .join("\n");

    finalBody = `${indent}ScrollView {\n${innerIndented}\n${indent}.padding()\n${indent}}`;
  }

  if (options.target === "playgrounds-app") {
    // Swift Playgrounds 4 App format
    return `//
// Swift Playgrounds 4 App
// Converted from HTML on ${new Date().toLocaleDateString()}
// Compatible with Swift 6, iOS 17 & 18, and macOS Playgrounds
//

import SwiftUI

@main
struct PlaygroundsApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

struct ContentView: View {
${stateDeclarations}
    var body: some View {
${finalBody}
    }
}

#Preview {
    ContentView()
}
`;
  }

  if (options.target === "playground-page") {
    // Classic Playground Page format
    return `//
// Swift Playground Page
// Converted from HTML on ${new Date().toLocaleDateString()}
//

import SwiftUI
import PlaygroundSupport

struct ContentView: View {
${stateDeclarations}
    var body: some View {
${finalBody}
    }
}

// Set the active Playground live canvas
PlaygroundPage.current.setLiveView(ContentView())
`;
  }

  // Standalone SwiftUI View
  return `//
// SwiftUI View Component
// Converted from HTML
//

import SwiftUI

struct ContentView: View {
${stateDeclarations}
    var body: some View {
${finalBody}
    }
}

#Preview {
    ContentView()
}
`;
}
