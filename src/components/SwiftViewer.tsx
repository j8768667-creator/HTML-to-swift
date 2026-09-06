import React, { useState } from "react";
import { Copy, Download, Check, Sparkles, Code, Info, Sun, Moon } from "lucide-react";
import { ConversionResult, ConversionOptions } from "../types";

interface SwiftViewerProps {
  result: ConversionResult;
  options: ConversionOptions;
  onCopy: () => void;
  hasCopied: boolean;
  onDownload: () => void;
  onConvertWithAi: () => void;
  isAiLoading: boolean;
  aiError: string | null;
}

export const SwiftViewer: React.FC<SwiftViewerProps> = ({
  result,
  options,
  onCopy,
  hasCopied,
  onDownload,
  onConvertWithAi,
  isAiLoading,
  aiError,
}) => {
  const [isDarkCode, setIsDarkCode] = useState<boolean>(false);

  const lines = result.swiftCode.split("\n");
  const lineCount = lines.length;

  // Clean Minimalism syntax highlighter matching Design HTML specifications
  const renderHighlightedLine = (line: string) => {
    // Comments
    if (line.trim().startsWith("//") || line.trim().startsWith("/*")) {
      return (
        <span className={isDarkCode ? "text-[#FBBF24] italic" : "text-[#D97706] italic"}>
          {line}
        </span>
      );
    }

    // Split tokens safely
    const tokenRegex = /(@main|@State|@Observable|#Preview|import|struct|var|let|some|Scene|View|body|switch|case|default|if|else|func|private|return|true|false)|([A-Z][a-zA-Z0-9_]*)|(\.[a-zA-Z0-9_]+)|("(?:[^"\\]|\\.)*")|(\/\/.*$)/g;

    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    let match;

    while ((match = tokenRegex.exec(line)) !== null) {
      if (match.index > lastIdx) {
        parts.push(line.substring(lastIdx, match.index));
      }

      if (match[1]) {
        // Swift Keywords & Attributes (Purple in Clean Minimalism design)
        parts.push(
          <span
            key={match.index}
            className={`${isDarkCode ? "text-[#D8B4FE]" : "text-[#9333EA]"} font-medium`}
          >
            {match[1]}
          </span>
        );
      } else if (match[2]) {
        // Types & Protocols (Blue in Clean Minimalism design)
        parts.push(
          <span
            key={match.index}
            className={`${isDarkCode ? "text-[#60A5FA]" : "text-[#2563EB]"} font-medium`}
          >
            {match[2]}
          </span>
        );
      } else if (match[3]) {
        // Modifiers / Methods (.padding, .frame, etc.)
        parts.push(
          <span
            key={match.index}
            className={isDarkCode ? "text-[#38BDF8]" : "text-[#0284C7]"}
          >
            {match[3]}
          </span>
        );
      } else if (match[4]) {
        // Strings (Emerald in Clean Minimalism design)
        parts.push(
          <span
            key={match.index}
            className={isDarkCode ? "text-[#34D399]" : "text-[#059669]"}
          >
            {match[4]}
          </span>
        );
      } else if (match[5]) {
        // Trailing comments (Amber in Clean Minimalism design)
        parts.push(
          <span
            key={match.index}
            className={`${isDarkCode ? "text-[#FBBF24]" : "text-[#D97706]"} italic`}
          >
            {match[5]}
          </span>
        );
      }

      lastIdx = tokenRegex.lastIndex;
    }

    if (lastIdx < line.length) {
      parts.push(line.substring(lastIdx));
    }

    return parts;
  };

  return (
    <div
      className={`flex flex-col h-full border border-[#EEEEEE] rounded overflow-hidden transition-colors ${
        isDarkCode ? "bg-[#18181D] text-gray-100" : "bg-[#FDFDFD] text-[#1F2937]"
      }`}
    >
      {/* Header - Matches Clean Minimalism Section Header */}
      <div
        className={`h-10 flex items-center justify-between px-4 sm:px-6 border-b shrink-0 transition-colors ${
          isDarkCode
            ? "bg-[#141418] border-gray-800 text-gray-300"
            : "bg-[#F9FAFB] border-[#EEEEEE] text-[#6B7280]"
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-[11px] font-medium uppercase tracking-wider">
            Swift SwiftUI Output
          </span>
          <span className="text-[10px] text-[#F05138] font-semibold bg-orange-50 px-2 py-0.5 rounded border border-orange-200/50">
            Playgrounds Ready
          </span>

          {result.isAiGenerated && (
            <span className="inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200/60 font-medium">
              <Sparkles className="w-2.5 h-2.5 text-purple-600" />
              <span>Gemini AI</span>
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          {/* Light/Dark code view toggle */}
          <button
            onClick={() => setIsDarkCode(!isDarkCode)}
            className={`p-1 rounded text-xs transition-colors cursor-pointer ${
              isDarkCode
                ? "text-gray-400 hover:text-white bg-gray-800"
                : "text-[#6B7280] hover:text-[#1A1A1A] bg-white border border-[#E5E7EB]"
            }`}
            title={isDarkCode ? "Switch to Clean Minimalist Light Mode" : "Switch to Dark Code Mode"}
          >
            {isDarkCode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            id="btn-copy-swift"
            onClick={onCopy}
            className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors flex items-center space-x-1.5 cursor-pointer ${
              isDarkCode
                ? "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200"
                : "bg-white hover:bg-[#F9FAFB] border-[#E5E7EB] text-[#4B5563] hover:text-[#1A1A1A]"
            }`}
          >
            {hasCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[#10B981] font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            id="btn-download-swift-panel"
            onClick={onDownload}
            className="px-2.5 py-1 rounded text-xs font-medium bg-[#1A1A1A] hover:bg-[#333333] text-white transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            title="Download .swift file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* AI Error Alert if any */}
      {aiError && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-red-700 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-red-500" />
            <span>{aiError}</span>
          </div>
        </div>
      )}

      {/* Code Display Area */}
      <div className="relative flex-1 min-h-[440px] flex overflow-hidden">
        <div className="flex w-full h-full code-font text-xs leading-relaxed overflow-hidden">
          {/* Gutter / Line Numbers */}
          <div
            className={`w-11 select-none py-3 text-right pr-2.5 shrink-0 border-r overflow-hidden code-font ${
              isDarkCode
                ? "bg-[#141418] text-gray-600 border-gray-800"
                : "bg-[#F9FAFB] text-[#9CA3AF] border-[#EEEEEE]"
            }`}
          >
            {lines.map((_, i) => (
              <div key={i} className="leading-6 text-[11px]">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code Body */}
          <div
            className={`flex-1 p-4 overflow-auto code-font text-xs leading-6 scrollbar-hide selection:bg-[#F05138]/20 ${
              isDarkCode ? "text-gray-200" : "text-[#1F2937]"
            }`}
          >
            <pre className="m-0 code-font">
              <code>
                {lines.map((line, i) => (
                  <div key={i} className="whitespace-pre">
                    {renderHighlightedLine(line)}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Footer / Diagnostics - Matches Design HTML */}
      <div
        className={`h-8 px-4 border-t flex flex-wrap items-center justify-between text-[11px] shrink-0 transition-colors ${
          isDarkCode
            ? "bg-[#141418] border-gray-800 text-gray-500"
            : "bg-[#F9FAFB] border-[#EEEEEE] text-[#9CA3AF]"
        }`}
      >
        <div className="flex items-center space-x-3">
          <span>{result.diagnostics.elementsProcessed} elements</span>
          <span>·</span>
          <span>{result.diagnostics.stateVarsCount} @State</span>
          <span>·</span>
          <span>Depth: {result.diagnostics.depth}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>{result.diagnostics.processingTimeMs}ms</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block" />
          <span className={isDarkCode ? "text-gray-300" : "text-[#4B5563]"}>Swift 6 Compatible</span>
        </div>
      </div>
    </div>
  );
};
