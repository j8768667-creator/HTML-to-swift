import React, { useState, useRef } from "react";
import { Code2, Eye, Upload, Trash2, AlignLeft, PlusCircle, Check } from "lucide-react";

interface HtmlEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export const HtmlEditor: React.FC<HtmlEditorProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [formatNotice, setFormatNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lines = value.split("\n");
  const lineCount = lines.length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onChange(content);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  const handleFormatHtml = () => {
    try {
      // Basic aesthetic indentation formatter for HTML
      let formatted = "";
      let indent = 0;
      const clean = value.replace(/>\s*</g, "><").trim();
      const tokens = clean.split(/(<[^>]+>)/g).filter(Boolean);

      for (const token of tokens) {
        if (token.startsWith("</")) {
          indent = Math.max(0, indent - 1);
          formatted += "  ".repeat(indent) + token + "\n";
        } else if (token.startsWith("<") && !token.endsWith("/>") && !token.startsWith("<!") && !token.startsWith("<img") && !token.startsWith("<input") && !token.startsWith("<hr") && !token.startsWith("<br")) {
          formatted += "  ".repeat(indent) + token + "\n";
          indent++;
        } else if (token.startsWith("<")) {
          formatted += "  ".repeat(indent) + token + "\n";
        } else {
          const text = token.trim();
          if (text) {
            formatted += "  ".repeat(indent) + text + "\n";
          }
        }
      }

      onChange(formatted.trim());
      setFormatNotice(true);
      setTimeout(() => setFormatNotice(false), 1500);
    } catch {
      // ignore
    }
  };

  const insertSnippet = (snippet: string) => {
    onChange((value ? value + "\n\n" : "") + snippet);
  };

  return (
    <div className="flex flex-col h-full bg-white border border-[#EEEEEE] rounded overflow-hidden">
      {/* Editor Header - Matches Design HTML Clean Minimalism Header */}
      <div className="h-10 flex items-center justify-between px-4 sm:px-6 bg-[#F9FAFB] border-b border-[#EEEEEE] shrink-0">
        <div className="flex items-center space-x-3">
          <span className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
            Source HTML
          </span>
          <div className="inline-flex rounded border border-[#E5E7EB] bg-white p-0.5">
            <button
              id="tab-html-code"
              onClick={() => setActiveTab("code")}
              className={`flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                activeTab === "code"
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#6B7280] hover:text-[#1A1A1A]"
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>Markup</span>
            </button>
            <button
              id="tab-html-preview"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                activeTab === "preview"
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#6B7280] hover:text-[#1A1A1A]"
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-[10px] text-[#9CA3AF] font-mono hidden sm:inline">UTF-8</span>
          <div className="h-3 w-px bg-[#E5E7EB] hidden sm:block" />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".html,.htm,.txt"
            className="hidden"
          />
          <button
            id="btn-upload-html"
            onClick={() => fileInputRef.current?.click()}
            className="p-1 text-[#6B7280] hover:text-[#1A1A1A] hover:bg-white rounded transition-colors cursor-pointer"
            title="Upload HTML file"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-format-html"
            onClick={handleFormatHtml}
            className="p-1 text-[#6B7280] hover:text-[#1A1A1A] hover:bg-white rounded transition-colors cursor-pointer"
            title="Beautify HTML"
          >
            {formatNotice ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <AlignLeft className="w-3.5 h-3.5" />}
          </button>
          <button
            id="btn-clear-html"
            onClick={() => onChange("")}
            className="p-1 text-[#6B7280] hover:text-red-600 hover:bg-white rounded transition-colors cursor-pointer"
            title="Clear HTML"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Snippet Quick Inserts */}
      <div className="px-4 py-1.5 bg-white border-b border-[#EEEEEE] flex items-center space-x-2 overflow-x-auto text-[11px] text-[#6B7280] shrink-0">
        <span className="shrink-0 text-[#9CA3AF] text-[10px] uppercase tracking-wider">Quick:</span>
        <button
          onClick={() => insertSnippet(`<button class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow" data-sf-symbol="star.fill">Click Me</button>`)}
          className="px-2 py-0.5 rounded bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#D1D5DB] hover:text-[#1A1A1A] text-[#4B5563] shrink-0 cursor-pointer transition-colors"
        >
          + Button
        </button>
        <button
          onClick={() => insertSnippet(`<input type="text" name="fullName" placeholder="Full name..." class="p-2 border rounded-md" />`)}
          className="px-2 py-0.5 rounded bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#D1D5DB] hover:text-[#1A1A1A] text-[#4B5563] shrink-0 cursor-pointer transition-colors"
        >
          + Text Field
        </button>
        <button
          onClick={() => insertSnippet(`<label class="flex items-center gap-2">\n  <input type="checkbox" name="agree" checked />\n  <span>I agree to the terms</span>\n</label>`)}
          className="px-2 py-0.5 rounded bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#D1D5DB] hover:text-[#1A1A1A] text-[#4B5563] shrink-0 cursor-pointer transition-colors"
        >
          + Toggle
        </button>
        <button
          onClick={() => insertSnippet(`<div class="flex flex-row items-center gap-3 p-3 bg-gray-100 rounded-xl">\n  <img src="https://picsum.photos/80" width="40" height="40" class="rounded-full" />\n  <div>\n    <strong class="text-sm">John Appleseed</strong>\n    <p class="text-xs text-gray-500">Online</p>\n  </div>\n</div>`)}
          className="px-2 py-0.5 rounded bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#D1D5DB] hover:text-[#1A1A1A] text-[#4B5563] shrink-0 cursor-pointer transition-colors"
        >
          + HStack Card
        </button>
      </div>

      {/* Body Area */}
      <div className="relative flex-1 min-h-[440px] flex overflow-hidden bg-white">
        {activeTab === "code" ? (
          <div className="flex w-full h-full code-font text-xs leading-relaxed overflow-hidden">
            {/* Gutter / Line Numbers */}
            <div className="w-10 select-none bg-[#F9FAFB] text-[#9CA3AF] py-3 text-right pr-2 shrink-0 border-r border-[#EEEEEE] overflow-hidden code-font">
              {Array.from({ length: Math.max(lineCount, 24) }, (_, i) => (
                <div key={i} className="leading-6 text-[11px]">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              id="html-code-input"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="<!-- Paste your HTML, SVG, or Tailwind CSS code here -->&#10;<div class='card'>&#10;  <img src='profile.jpg' class='avatar' />&#10;  <div class='content'>&#10;    <h1>Elena Rossi</h1>&#10;    <p>Lead Product Designer</p>&#10;    <button onclick='connect()'>Connect</button>&#10;  </div>&#10;</div>"
              className="flex-1 w-full h-full p-4 resize-none outline-hidden bg-white text-[#4B5563] code-font text-xs leading-6 overflow-auto focus:ring-0"
              spellCheck={false}
            />
          </div>
        ) : (
          /* Live HTML Preview inside sandboxed container */
          <div className="w-full h-full p-6 bg-[#FAFAFA] overflow-auto flex items-center justify-center">
            <div className="w-full max-w-lg bg-white rounded border border-[#EEEEEE] p-6 overflow-auto shadow-2xs">
              <div
                className="preview-host"
                dangerouslySetInnerHTML={{ __html: value || "<div class='text-[#9CA3AF] text-center py-8 text-xs'>No HTML provided to render</div>" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="h-8 px-4 bg-[#F9FAFB] border-t border-[#EEEEEE] flex items-center justify-between text-[11px] text-[#9CA3AF] shrink-0">
        <span>{lineCount} lines · {value.length} characters</span>
        <span>HTML5 / Semantic DOM</span>
      </div>
    </div>
  );
};
