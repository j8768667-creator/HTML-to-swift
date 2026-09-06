/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { OptionsBar } from "./components/OptionsBar";
import { HtmlEditor } from "./components/HtmlEditor";
import { SwiftViewer } from "./components/SwiftViewer";
import { DeviceSimulator } from "./components/DeviceSimulator";
import { PlaygroundGuideModal } from "./components/PlaygroundGuideModal";
import { PRESET_TEMPLATES } from "./data/templates";
import { ConversionOptions, ConversionResult } from "./types";
import { convertHtmlToSwiftUI } from "./utils/htmlToSwiftUI";
import { Code, Smartphone, Sparkles, Layers } from "lucide-react";

export default function App() {
  // Current HTML input
  const [html, setHtml] = useState<string>(PRESET_TEMPLATES[0].html);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(PRESET_TEMPLATES[0].id);

  // Conversion options
  const [options, setOptions] = useState<ConversionOptions>({
    target: "playgrounds-app",
    swiftVersion: "swift6",
    autoDetectState: true,
    mapSFSymbols: true,
    wrapInScrollView: false,
    useObservableMacro: true,
    includePreview: true,
    indentSize: 4,
  });

  // UI States
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [activeRightTab, setActiveRightTab] = useState<"code" | "simulator">("code");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Instant deterministic translation
  const deterministicResult = useMemo(() => {
    return convertHtmlToSwiftUI(html, options);
  }, [html, options]);

  // Combined result (AI override if available, otherwise deterministic)
  const currentResult: ConversionResult = useMemo(() => {
    if (aiResult) {
      return {
        ...deterministicResult,
        swiftCode: aiResult,
        isAiGenerated: true,
      };
    }
    return deterministicResult;
  }, [aiResult, deterministicResult]);

  // When user changes template
  const handleSelectTemplate = useCallback((id: string) => {
    setSelectedTemplateId(id);
    setAiResult(null);
    setAiError(null);
    if (id === "custom") {
      setHtml("");
    } else {
      const found = PRESET_TEMPLATES.find((t) => t.id === id);
      if (found) {
        setHtml(found.html);
      }
    }
  }, []);

  // When user edits HTML manually
  const handleHtmlChange = useCallback((newHtml: string) => {
    setHtml(newHtml);
    setAiResult(null); // reset AI result on edit to show live converted updates
    setAiError(null);
  }, []);

  // Options update
  const handleOptionsChange = useCallback((updated: Partial<ConversionOptions>) => {
    setOptions((prev) => ({ ...prev, ...updated }));
    setAiResult(null);
  }, []);

  // Copy to clipboard
  const handleCopySwift = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentResult.swiftCode);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = currentResult.swiftCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  }, [currentResult.swiftCode]);

  // Download .swift file
  const handleDownloadSwift = useCallback(() => {
    const filename = options.target === "playgrounds-app" ? "PlaygroundsApp.swift" : "ContentView.swift";
    const blob = new Blob([currentResult.swiftCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [currentResult.swiftCode, options.target]);

  // Convert / Refine using Gemini AI
  const handleConvertWithAi = useCallback(async () => {
    if (!html.trim()) return;

    setIsAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch("/api/convert-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          target: options.target,
          swiftVersion: options.swiftVersion,
          stateDetection: options.autoDetectState,
          includeComments: true,
        }),
      });

      if (!response.ok) {
        let errorMsg = `Server error (${response.status})`;
        try {
          const errData = await response.json();
          if (errData?.error) errorMsg = errData.error;
        } catch {
          if (response.status === 404) {
            errorMsg = "AI backend is unavailable on static hosting (GitHub Pages). The offline compiler is active!";
          }
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();

      if (data.swiftCode) {
        setAiResult(data.swiftCode);
        setActiveRightTab("code");
      }
    } catch (err: any) {
      setAiError(err.message || "Failed to connect to Gemini AI. Showing instant offline translation.");
    } finally {
      setIsAiLoading(false);
    }
  }, [html, options]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans antialiased text-[#1A1A1A]">
      {/* Top Navigation */}
      <Navbar
        selectedTemplateId={selectedTemplateId}
        onSelectTemplate={handleSelectTemplate}
        onCopySwift={handleCopySwift}
        hasCopied={hasCopied}
        onDownloadSwift={handleDownloadSwift}
        onOpenGuide={() => setIsGuideOpen(true)}
        onConvertWithAi={handleConvertWithAi}
        isAiLoading={isAiLoading}
      />

      {/* Secondary Options Bar */}
      <OptionsBar options={options} onChangeOptions={handleOptionsChange} />

      {/* Main Dual-Pane Workspace */}
      <main className="flex-1 w-full mx-auto p-3 sm:p-4 lg:p-5 flex flex-col space-y-3">
        {/* Workspace Subheading with View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280]">
              Workspace
            </span>
            <span className="text-xs text-[#9CA3AF] hidden sm:inline">
              · Paste HTML on left for real-time Swift Playgrounds code on right
            </span>
          </div>

          {/* Right Pane Tab Switcher */}
          <div className="inline-flex rounded border border-[#E5E7EB] bg-white p-0.5">
            <button
              id="tab-swift-code"
              onClick={() => setActiveRightTab("code")}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeRightTab === "code"
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#6B7280] hover:text-[#1A1A1A]"
              }`}
            >
              <Code className="w-3.5 h-3.5 text-[#F05138]" />
              <span>Swift Code</span>
            </button>
            <button
              id="tab-swift-simulator"
              onClick={() => setActiveRightTab("simulator")}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeRightTab === "simulator"
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#6B7280] hover:text-[#1A1A1A]"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-500" />
              <span>Canvas Simulator</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          {/* Left: HTML / CSS Editor */}
          <div className="h-[620px] lg:h-[calc(100vh-210px)] min-h-[500px]">
            <HtmlEditor value={html} onChange={handleHtmlChange} />
          </div>

          {/* Right: Swift Playgrounds Code or Device Simulator */}
          <div className="h-[620px] lg:h-[calc(100vh-210px)] min-h-[500px]">
            {activeRightTab === "code" ? (
              <SwiftViewer
                result={currentResult}
                options={options}
                onCopy={handleCopySwift}
                hasCopied={hasCopied}
                onDownload={handleDownloadSwift}
                onConvertWithAi={handleConvertWithAi}
                isAiLoading={isAiLoading}
                aiError={aiError}
              />
            ) : (
              <DeviceSimulator html={html} result={currentResult} />
            )}
          </div>
        </div>
      </main>

      {/* Clean Minimalism Bottom Status Bar */}
      <footer className="h-8 border-t border-[#EEEEEE] bg-white flex items-center justify-between px-4 sm:px-6 text-[11px] text-[#6B7280] shrink-0">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span>Real-time compiler active</span>
        </div>
        <div className="flex items-center space-x-4 text-[#9CA3AF]">
          <span>Swift 6.0</span>
          <span>·</span>
          <span>Apple Swift Playgrounds 4</span>
        </div>
      </footer>

      {/* Guide Modal */}
      <PlaygroundGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onCopySwift={handleCopySwift}
      />
    </div>
  );
}
