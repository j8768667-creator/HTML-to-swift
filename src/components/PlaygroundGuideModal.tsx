import React from "react";
import { X, Tablet, Laptop, Copy } from "lucide-react";

interface PlaygroundGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopySwift: () => void;
}

export const PlaygroundGuideModal: React.FC<PlaygroundGuideModalProps> = ({
  isOpen,
  onClose,
  onCopySwift,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded border border-[#EEEEEE] max-w-lg w-full p-6 shadow-xl overflow-hidden relative text-[#1A1A1A]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded text-[#9CA3AF] hover:text-[#1A1A1A] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-9 h-9 rounded bg-[#FAFAFA] border border-[#EEEEEE] text-[#F05138] flex items-center justify-center">
            <Tablet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1A1A1A]">How to Run in Swift Playgrounds</h3>
            <p className="text-xs text-[#6B7280]">Tested with Apple Swift Playgrounds 4 on iPadOS & macOS</p>
          </div>
        </div>

        {/* Step-by-step instructions */}
        <div className="space-y-3 my-4 text-xs text-[#4B5563]">
          {/* Method 1: iPad Playgrounds App */}
          <div className="p-4 rounded bg-[#FAFAFA] border border-[#EEEEEE]">
            <div className="flex items-center space-x-2 font-medium text-[#1A1A1A] mb-2 text-xs">
              <Tablet className="w-3.5 h-3.5 text-[#F05138]" />
              <span>Option A: Swift Playgrounds on iPad</span>
            </div>
            <ol className="space-y-1.5 list-decimal list-inside text-[#4B5563] leading-relaxed">
              <li>Open <strong>Swift Playgrounds</strong> on iPad (free on App Store).</li>
              <li>Tap <strong>New App</strong> (plus icon) in the bottom toolbar.</li>
              <li>Open <strong>ContentView.swift</strong> from the project navigator.</li>
              <li>Select all existing code and <strong>Paste</strong> the converted Swift output.</li>
              <li>Tap the <strong>Run</strong> button in the top bar to preview live!</li>
            </ol>
          </div>

          {/* Method 2: Mac Playgrounds or Xcode */}
          <div className="p-4 rounded bg-[#FAFAFA] border border-[#EEEEEE]">
            <div className="flex items-center space-x-2 font-medium text-[#1A1A1A] mb-2 text-xs">
              <Laptop className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>Option B: Swift Playgrounds or Xcode on Mac</span>
            </div>
            <ol className="space-y-1.5 list-decimal list-inside text-[#4B5563] leading-relaxed">
              <li>Launch <strong>Swift Playgrounds</strong> (or Xcode) on macOS.</li>
              <li>Choose <strong>File → New App</strong> or New Playground.</li>
              <li>Paste code or drag the exported <code>.swift</code> file into your project.</li>
              <li>Press <strong>⌘ + R</strong> to build and run in the live preview canvas.</li>
            </ol>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#EEEEEE]">
          <button
            onClick={onCopySwift}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium bg-[#1A1A1A] text-white hover:bg-[#333333] transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Swift Code</span>
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs font-medium text-[#6B7280] hover:text-[#1A1A1A] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
