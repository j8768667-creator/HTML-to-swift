import React from "react";
import { ConversionOptions, TargetFormat, SwiftVersion } from "../types";
import { SlidersHorizontal, Layers, Sparkles, Wand2 } from "lucide-react";

interface OptionsBarProps {
  options: ConversionOptions;
  onChangeOptions: (updated: Partial<ConversionOptions>) => void;
}

export const OptionsBar: React.FC<OptionsBarProps> = ({ options, onChangeOptions }) => {
  return (
    <div className="bg-[#F9FAFB] border-b border-[#EEEEEE] px-4 sm:px-6 lg:px-8 py-2 text-xs shrink-0">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Target Format Selector */}
        <div className="flex items-center space-x-2.5">
          <span className="text-[#6B7280] font-medium text-[11px] uppercase tracking-wider">
            Target:
          </span>
          <div className="inline-flex rounded border border-[#E5E7EB] bg-white p-0.5">
            <button
              id="opt-target-app"
              onClick={() => onChangeOptions({ target: "playgrounds-app" })}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                options.target === "playgrounds-app"
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#6B7280] hover:text-[#1A1A1A]"
              }`}
              title="Swift Playgrounds 4 App with @main struct PlaygroundsApp: App"
            >
              Playgrounds App (@main)
            </button>
            <button
              id="opt-target-page"
              onClick={() => onChangeOptions({ target: "playground-page" })}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                options.target === "playground-page"
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#6B7280] hover:text-[#1A1A1A]"
              }`}
              title="Classic Playground Page with PlaygroundPage.current.setLiveView"
            >
              Playground Page
            </button>
            <button
              id="opt-target-view"
              onClick={() => onChangeOptions({ target: "swiftui-view" })}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                options.target === "swiftui-view"
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#6B7280] hover:text-[#1A1A1A]"
              }`}
              title="Standalone SwiftUI View struct ContentView: View"
            >
              View Only
            </button>
          </div>
        </div>

        {/* Right: Feature Toggles */}
        <div className="flex flex-wrap items-center space-x-4 text-[#6B7280]">
          {/* Swift Version */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[#9CA3AF] text-[11px] uppercase tracking-wider">Dialect:</span>
            <select
              id="opt-swift-version"
              value={options.swiftVersion}
              onChange={(e) => onChangeOptions({ swiftVersion: e.target.value as SwiftVersion })}
              className="bg-white border border-[#E5E7EB] rounded px-2 py-0.5 text-[11px] text-[#4B5563] outline-hidden hover:border-[#D1D5DB] focus:border-[#1A1A1A] cursor-pointer"
            >
              <option value="swift6">Swift 6 / iOS 18</option>
              <option value="swift5">Swift 5.9 / iOS 17</option>
            </select>
          </div>

          {/* State Detection Toggle */}
          <label className="flex items-center space-x-1.5 cursor-pointer select-none text-[#4B5563] hover:text-[#1A1A1A]">
            <input
              type="checkbox"
              id="opt-auto-state"
              checked={options.autoDetectState}
              onChange={(e) => onChangeOptions({ autoDetectState: e.target.checked })}
              className="rounded border-[#D1D5DB] text-[#1A1A1A] focus:ring-0 w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-[11px]">Auto @State variables</span>
          </label>

          {/* SF Symbols Mapping */}
          <label className="flex items-center space-x-1.5 cursor-pointer select-none text-[#4B5563] hover:text-[#1A1A1A]">
            <input
              type="checkbox"
              id="opt-sf-symbols"
              checked={options.mapSFSymbols}
              onChange={(e) => onChangeOptions({ mapSFSymbols: e.target.checked })}
              className="rounded border-[#D1D5DB] text-[#1A1A1A] focus:ring-0 w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-[11px]">SF Symbols mapping</span>
          </label>

          {/* ScrollView Wrapper */}
          <label className="flex items-center space-x-1.5 cursor-pointer select-none text-[#4B5563] hover:text-[#1A1A1A]">
            <input
              type="checkbox"
              id="opt-scrollview"
              checked={options.wrapInScrollView}
              onChange={(e) => onChangeOptions({ wrapInScrollView: e.target.checked })}
              className="rounded border-[#D1D5DB] text-[#1A1A1A] focus:ring-0 w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-[11px]">Wrap in ScrollView</span>
          </label>
        </div>
      </div>
    </div>
  );
};
