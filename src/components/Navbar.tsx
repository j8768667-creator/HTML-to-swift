import React from "react";
import { Copy, Download, BookOpen, Sparkles, Check, Code, Play } from "lucide-react";
import { PRESET_TEMPLATES } from "../data/templates";

interface NavbarProps {
  selectedTemplateId: string;
  onSelectTemplate: (id: string) => void;
  onCopySwift: () => void;
  hasCopied: boolean;
  onDownloadSwift: () => void;
  onOpenGuide: () => void;
  onConvertWithAi: () => void;
  isAiLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  onCopySwift,
  hasCopied,
  onDownloadSwift,
  onOpenGuide,
  onConvertWithAi,
  isAiLoading,
}) => {
  return (
    <nav className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white border-b border-[#EEEEEE] shrink-0 sticky top-0 z-30">
      {/* Left: Brand Identity */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="w-8 h-8 bg-[#F05138] rounded-lg flex items-center justify-center text-white font-bold text-base shadow-2xs shrink-0">
          S
        </div>
        <div className="flex items-center space-x-2">
          <h1 className="text-sm font-semibold tracking-tight uppercase text-[#1A1A1A]">
            Swiftify HTML
          </h1>
          <span className="text-[10px] px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] rounded border border-[#E5E7EB] font-mono hidden xs:inline-block">
            v4.4.2
          </span>
        </div>

        {/* Status Indicator */}
        <div className="hidden md:flex items-center space-x-2 text-xs text-[#6B7280] pl-3 border-l border-[#EEEEEE]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span>Parser Active</span>
        </div>
      </div>

      {/* Center: Template Picker */}
      <div className="flex items-center space-x-2">
        <label htmlFor="template-select" className="text-xs text-[#6B7280] hidden lg:inline">
          Template:
        </label>
        <select
          id="template-select"
          value={selectedTemplateId}
          onChange={(e) => onSelectTemplate(e.target.value)}
          className="text-xs text-[#4B5563] bg-white border border-[#E5E7EB] rounded px-2.5 py-1.5 hover:border-[#D1D5DB] focus:border-[#1A1A1A] outline-hidden transition cursor-pointer"
        >
          <option value="custom">Scratchpad (Empty)</option>
          {PRESET_TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* AI Refine button */}
        <button
          id="btn-convert-ai"
          onClick={onConvertWithAi}
          disabled={isAiLoading}
          className="px-3.5 sm:px-4 py-2 bg-[#1A1A1A] text-white text-xs font-medium rounded hover:bg-[#333333] transition-colors flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer shadow-2xs"
          title="Refine with Gemini AI for complex layouts & animations"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{isAiLoading ? "Transpiling..." : "Transpile to Swift"}</span>
          <span className="sm:hidden">{isAiLoading ? "..." : "Transpile"}</span>
        </button>

        {/* Copy Swift button */}
        <button
          id="btn-copy-swift-top"
          onClick={onCopySwift}
          className="px-3 py-2 bg-white text-[#4B5563] hover:text-[#1A1A1A] hover:bg-[#F9FAFB] text-xs font-medium rounded border border-[#E5E7EB] transition-colors flex items-center space-x-1.5 cursor-pointer"
        >
          {hasCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-[#10B981] font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>Copy</span>
            </>
          )}
        </button>

        {/* Download button */}
        <button
          id="btn-download-swift"
          onClick={onDownloadSwift}
          className="px-3 py-2 bg-white text-[#4B5563] hover:text-[#1A1A1A] hover:bg-[#F9FAFB] text-xs font-medium rounded border border-[#E5E7EB] transition-colors flex items-center space-x-1.5 cursor-pointer"
          title="Export .swift file"
        >
          <Download className="w-3.5 h-3.5 text-[#6B7280]" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Guide button */}
        <button
          id="btn-open-guide"
          onClick={onOpenGuide}
          className="p-2 text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F9FAFB] rounded border border-transparent hover:border-[#E5E7EB] transition-colors cursor-pointer"
          title="How to run in Swift Playgrounds"
        >
          <BookOpen className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
