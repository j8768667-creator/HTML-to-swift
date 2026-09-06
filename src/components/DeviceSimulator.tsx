import React, { useState } from "react";
import { Smartphone, Tablet, Sun, Moon, Sparkles, RefreshCw } from "lucide-react";
import { ConversionResult } from "../types";

interface DeviceSimulatorProps {
  html: string;
  result: ConversionResult;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({ html, result }) => {
  const [deviceType, setDeviceType] = useState<"iphone" | "ipad">("iphone");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] border border-[#EEEEEE] rounded overflow-hidden">
      {/* Simulator Toolbar */}
      <div className="h-10 flex items-center justify-between px-4 sm:px-6 bg-[#F9FAFB] border-b border-[#EEEEEE] shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
            SwiftUI Canvas Simulator
          </span>
          <span className="text-[10px] text-[#9CA3AF] hidden sm:inline font-mono">
            {deviceType === "iphone" ? "iPhone 16 Pro" : "iPad Air 11″"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Device form factor toggle */}
          <div className="inline-flex rounded border border-[#E5E7EB] bg-white p-0.5">
            <button
              onClick={() => setDeviceType("iphone")}
              className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                deviceType === "iphone" ? "bg-[#1A1A1A] text-white" : "text-[#6B7280] hover:text-[#1A1A1A]"
              }`}
              title="iPhone Canvas"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceType("ipad")}
              className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                deviceType === "ipad" ? "bg-[#1A1A1A] text-white" : "text-[#6B7280] hover:text-[#1A1A1A]"
              }`}
              title="iPad Canvas"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Light/Dark Appearance toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-1 rounded bg-white border border-[#E5E7EB] transition-colors cursor-pointer ${
              isDarkMode ? "text-amber-400 bg-gray-900 border-gray-800" : "text-[#6B7280] hover:text-[#1A1A1A]"
            }`}
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Device Frame Viewport */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-[#FAFAFA]">
        <div
          className={`transition-all duration-300 shadow-xl rounded-[38px] p-3 ring-1 ring-black/10 flex flex-col ${
            isDarkMode ? "bg-[#1C1C1E] text-white" : "bg-[#F2F2F7] text-[#1A1A1A]"
          } ${
            deviceType === "iphone" ? "w-[320px] sm:w-[360px] min-h-[580px] max-h-[640px]" : "w-full max-w-[620px] min-h-[500px]"
          }`}
        >
          {/* Dynamic Island / Bezel Top */}
          <div className="flex items-center justify-between px-6 py-2">
            <span className="text-[11px] font-semibold text-[#9CA3AF]">9:41</span>
            {deviceType === "iphone" && (
              <div className="w-20 h-4.5 rounded-full bg-black mx-auto shadow-inner" />
            )}
            <div className="flex items-center space-x-1 text-[11px] text-[#9CA3AF]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" />
              <span>5G</span>
            </div>
          </div>

          {/* Canvas Screen Content */}
          <div
            className={`flex-1 rounded-[28px] overflow-auto p-4 transition-colors ${
              isDarkMode ? "bg-black" : "bg-white"
            } border border-black/5`}
          >
            <div
              className={`preview-render-area w-full ${isDarkMode ? "dark-theme" : ""}`}
              dangerouslySetInnerHTML={{
                __html: html || "<div class='text-center py-12 text-[#9CA3AF] text-xs'>Empty view</div>",
              }}
            />
          </div>

          {/* Home Indicator Bar */}
          <div className="py-2 flex justify-center">
            <div className="w-32 h-1 rounded-full bg-gray-400/30" />
          </div>
        </div>
      </div>

      {/* Simulator Footer */}
      <div className="h-8 px-4 bg-[#F9FAFB] border-t border-[#EEEEEE] flex items-center justify-between text-[11px] text-[#9CA3AF] shrink-0">
        <span>Display Scale @2x · Retina</span>
        <span>iOS 18 Viewport</span>
      </div>
    </div>
  );
};
