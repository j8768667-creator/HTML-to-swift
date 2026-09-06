// CSS Style and Tailwind Utility Classes to SwiftUI Modifiers Converter

export interface ParsedSwiftModifiers {
  fontModifier?: string;
  fontWeight?: string;
  foregroundStyle?: string;
  background?: string;
  padding?: string;
  frame?: string;
  clipShape?: string;
  cornerRadiusVal?: number;
  shadow?: string;
  border?: string;
  opacity?: string;
  multilineTextAlignment?: string;
  layoutAlignment?: string;
  spacing?: number;
  isFlexRow?: boolean;
  isFlexCol?: boolean;
  isGrid?: boolean;
}

// Convert CSS Color or Tailwind color to SwiftUI Color
export function parseColorToSwift(val: string): string | null {
  const clean = val.trim().toLowerCase();

  // Named SwiftUI colors
  const swiftNamedColors: Record<string, string> = {
    blue: "Color.blue",
    red: "Color.red",
    green: "Color.green",
    orange: "Color.orange",
    purple: "Color.purple",
    pink: "Color.pink",
    yellow: "Color.yellow",
    gray: "Color.gray",
    grey: "Color.gray",
    white: "Color.white",
    black: "Color.black",
    transparent: "Color.clear",
    clear: "Color.clear",
    primary: "Color.primary",
    secondary: "Color.secondary",
  };

  if (swiftNamedColors[clean]) {
    return swiftNamedColors[clean];
  }

  // Hex color (#ffffff, #3B82F6, #fff)
  if (clean.startsWith("#")) {
    let hex = clean.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      return `Color(red: ${r.toFixed(2)}, green: ${g.toFixed(2)}, blue: ${b.toFixed(2)})`;
    }
  }

  // rgb/rgba
  const rgbMatch = clean.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbMatch) {
    const r = (parseInt(rgbMatch[1], 10) / 255).toFixed(2);
    const g = (parseInt(rgbMatch[2], 10) / 255).toFixed(2);
    const b = (parseInt(rgbMatch[3], 10) / 255).toFixed(2);
    const a = rgbMatch[4] ? parseFloat(rgbMatch[4]).toFixed(2) : "1.0";
    return `Color(red: ${r}, green: ${g}, blue: ${b}, opacity: ${a})`;
  }

  // Tailwind colors
  if (clean.includes("blue")) return "Color.blue";
  if (clean.includes("indigo")) return "Color.indigo";
  if (clean.includes("red") || clean.includes("rose")) return "Color.red";
  if (clean.includes("green") || clean.includes("emerald")) return "Color.green";
  if (clean.includes("purple") || clean.includes("violet")) return "Color.purple";
  if (clean.includes("amber") || clean.includes("yellow")) return "Color.orange";
  if (clean.includes("orange")) return "Color.orange";
  if (clean.includes("slate") || clean.includes("zinc") || clean.includes("gray")) return "Color.secondary";
  if (clean.includes("white")) return "Color.white";
  if (clean.includes("black")) return "Color.black";

  return null;
}

export function parseElementStyles(el: Element): ParsedSwiftModifiers {
  const result: ParsedSwiftModifiers = {};

  const styleAttr = el.getAttribute("style") || "";
  const classList = Array.from(el.classList);

  // 1. Process Tailwind classes
  for (const cls of classList) {
    // Flex / Layout
    if (cls === "flex" || cls === "inline-flex") {
      result.isFlexRow = true; // default flex in web is row unless flex-col
    }
    if (cls === "flex-row") {
      result.isFlexRow = true;
      result.isFlexCol = false;
    }
    if (cls === "flex-col") {
      result.isFlexCol = true;
      result.isFlexRow = false;
    }
    if (cls === "grid" || cls.startsWith("grid-cols-")) {
      result.isGrid = true;
    }

    // Gap / Spacing
    if (cls.startsWith("gap-")) {
      const num = parseInt(cls.replace("gap-", ""), 10);
      if (!isNaN(num)) result.spacing = num * 4;
    }
    if (cls.startsWith("space-x-") || cls.startsWith("space-y-")) {
      const num = parseInt(cls.split("-")[2], 10);
      if (!isNaN(num)) result.spacing = num * 4;
    }

    // Typography
    if (cls === "text-xs") result.fontModifier = ".font(.caption)";
    else if (cls === "text-sm") result.fontModifier = ".font(.subheadline)";
    else if (cls === "text-base") result.fontModifier = ".font(.body)";
    else if (cls === "text-lg") result.fontModifier = ".font(.headline)";
    else if (cls === "text-xl") result.fontModifier = ".font(.title3)";
    else if (cls === "text-2xl") result.fontModifier = ".font(.title2)";
    else if (cls === "text-3xl") result.fontModifier = ".font(.title)";
    else if (cls === "text-4xl" || cls === "text-5xl") result.fontModifier = ".font(.largeTitle)";

    // Font weights
    if (cls === "font-bold") result.fontWeight = ".bold()";
    else if (cls === "font-semibold") result.fontWeight = ".fontWeight(.semibold)";
    else if (cls === "font-medium") result.fontWeight = ".fontWeight(.medium)";
    else if (cls === "font-light") result.fontWeight = ".fontWeight(.light)";

    // Text Alignment
    if (cls === "text-center") result.multilineTextAlignment = ".multilineTextAlignment(.center)";
    else if (cls === "text-right") result.multilineTextAlignment = ".multilineTextAlignment(.trailing)";
    else if (cls === "text-left") result.multilineTextAlignment = ".multilineTextAlignment(.leading)";

    // Text Colors (e.g., text-white, text-blue-600, text-gray-500)
    if (cls.startsWith("text-") && !cls.startsWith("text-center") && !cls.startsWith("text-left") && !cls.startsWith("text-right")) {
      const colorKey = cls.replace("text-", "");
      const swiftColor = parseColorToSwift(colorKey);
      if (swiftColor) {
        result.foregroundStyle = `.foregroundStyle(${swiftColor})`;
      }
    }

    // Backgrounds (e.g., bg-blue-500, bg-white, bg-gray-100)
    if (cls.startsWith("bg-")) {
      const colorKey = cls.replace("bg-", "");
      const swiftColor = parseColorToSwift(colorKey);
      if (swiftColor) {
        result.background = `.background(${swiftColor})`;
      }
    }

    // Padding
    if (cls.startsWith("p-")) {
      const num = parseInt(cls.replace("p-", ""), 10);
      if (!isNaN(num)) result.padding = `.padding(${num * 4})`;
    } else if (cls.startsWith("px-")) {
      const num = parseInt(cls.replace("px-", ""), 10);
      if (!isNaN(num)) result.padding = `.padding(.horizontal, ${num * 4})`;
    } else if (cls.startsWith("py-")) {
      const num = parseInt(cls.replace("py-", ""), 10);
      if (!isNaN(num)) result.padding = `.padding(.vertical, ${num * 4})`;
    }

    // Border Radius
    if (cls === "rounded" || cls === "rounded-sm") {
      result.cornerRadiusVal = 4;
      result.clipShape = ".clipShape(RoundedRectangle(cornerRadius: 4))";
    } else if (cls === "rounded-md") {
      result.cornerRadiusVal = 8;
      result.clipShape = ".clipShape(RoundedRectangle(cornerRadius: 8))";
    } else if (cls === "rounded-lg") {
      result.cornerRadiusVal = 12;
      result.clipShape = ".clipShape(RoundedRectangle(cornerRadius: 12))";
    } else if (cls === "rounded-xl") {
      result.cornerRadiusVal = 16;
      result.clipShape = ".clipShape(RoundedRectangle(cornerRadius: 16))";
    } else if (cls === "rounded-2xl") {
      result.cornerRadiusVal = 20;
      result.clipShape = ".clipShape(RoundedRectangle(cornerRadius: 20))";
    } else if (cls === "rounded-3xl") {
      result.cornerRadiusVal = 28;
      result.clipShape = ".clipShape(RoundedRectangle(cornerRadius: 28))";
    } else if (cls === "rounded-full") {
      result.clipShape = ".clipShape(Capsule())";
    }

    // Shadows
    if (cls === "shadow" || cls === "shadow-sm") {
      result.shadow = ".shadow(color: .black.opacity(0.08), radius: 4, x: 0, y: 2)";
    } else if (cls === "shadow-md") {
      result.shadow = ".shadow(color: .black.opacity(0.12), radius: 8, x: 0, y: 4)";
    } else if (cls === "shadow-lg" || cls === "shadow-xl") {
      result.shadow = ".shadow(color: .black.opacity(0.18), radius: 16, x: 0, y: 8)";
    }

    // Width / Frame
    if (cls === "w-full") {
      result.frame = ".frame(maxWidth: .infinity)";
    }
  }

  // 2. Process inline styles (e.g. style="color: red; padding: 10px; ...")
  if (styleAttr) {
    const rules = styleAttr.split(";").map((r) => r.trim()).filter(Boolean);
    for (const rule of rules) {
      const [keyRaw, valRaw] = rule.split(":").map((s) => s.trim());
      if (!keyRaw || !valRaw) continue;

      const key = keyRaw.toLowerCase();
      const val = valRaw.toLowerCase();

      // Display / Flex
      if (key === "display") {
        if (val.includes("flex")) result.isFlexRow = true;
        if (val.includes("grid")) result.isGrid = true;
      }
      if (key === "flex-direction") {
        if (val.includes("column")) {
          result.isFlexCol = true;
          result.isFlexRow = false;
        } else if (val.includes("row")) {
          result.isFlexRow = true;
          result.isFlexCol = false;
        }
      }
      if (key === "gap") {
        const px = parseInt(val, 10);
        if (!isNaN(px)) result.spacing = px;
      }

      // Colors
      if (key === "color") {
        const c = parseColorToSwift(val);
        if (c) result.foregroundStyle = `.foregroundStyle(${c})`;
      }
      if (key === "background-color" || key === "background") {
        const c = parseColorToSwift(val);
        if (c) result.background = `.background(${c})`;
      }

      // Font size
      if (key === "font-size") {
        const px = parseInt(val, 10);
        if (!isNaN(px)) {
          result.fontModifier = `.font(.system(size: ${px}))`;
        }
      }

      // Font weight
      if (key === "font-weight") {
        if (val === "bold" || parseInt(val, 10) >= 700) {
          result.fontWeight = ".bold()";
        } else if (val === "600" || val === "semibold") {
          result.fontWeight = ".fontWeight(.semibold)";
        } else if (val === "500" || val === "medium") {
          result.fontWeight = ".fontWeight(.medium)";
        }
      }

      // Padding
      if (key === "padding") {
        const parts = val.split(/\s+/).map((p) => parseInt(p, 10)).filter((n) => !isNaN(n));
        if (parts.length === 1) {
          result.padding = `.padding(${parts[0]})`;
        } else if (parts.length === 2) {
          result.padding = `.padding(.vertical, ${parts[0]})\n.padding(.horizontal, ${parts[1]})`;
        } else if (parts.length >= 4) {
          result.padding = `.padding(EdgeInsets(top: ${parts[0]}, leading: ${parts[3]}, bottom: ${parts[2]}, trailing: ${parts[1]}))`;
        }
      }

      // Border radius
      if (key === "border-radius") {
        const r = parseInt(val, 10);
        if (!isNaN(r)) {
          result.cornerRadiusVal = r;
          result.clipShape = `.clipShape(RoundedRectangle(cornerRadius: ${r}))`;
        }
      }

      // Box shadow
      if (key === "box-shadow") {
        result.shadow = ".shadow(color: .black.opacity(0.12), radius: 8, x: 0, y: 4)";
      }

      // Opacity
      if (key === "opacity") {
        const op = parseFloat(val);
        if (!isNaN(op)) {
          result.opacity = `.opacity(${op})`;
        }
      }

      // Text align
      if (key === "text-align") {
        if (val === "center") result.multilineTextAlignment = ".multilineTextAlignment(.center)";
        else if (val === "right") result.multilineTextAlignment = ".multilineTextAlignment(.trailing)";
        else if (val === "left") result.multilineTextAlignment = ".multilineTextAlignment(.leading)";
      }

      // Width & Height
      if (key === "width" || key === "height") {
        const w = key === "width" ? parseInt(val, 10) : undefined;
        const h = key === "height" ? parseInt(val, 10) : undefined;
        if (w && h) result.frame = `.frame(width: ${w}, height: ${h})`;
        else if (w) result.frame = `.frame(width: ${w})`;
        else if (h) result.frame = `.frame(height: ${h})`;
      }
    }
  }

  return result;
}

export function compileModifiersToString(modifiers: ParsedSwiftModifiers, isTextElement = false): string[] {
  const lines: string[] = [];

  if (isTextElement) {
    if (modifiers.fontModifier) lines.push(modifiers.fontModifier);
    if (modifiers.fontWeight) lines.push(modifiers.fontWeight);
    if (modifiers.foregroundStyle) lines.push(modifiers.foregroundStyle);
    if (modifiers.multilineTextAlignment) lines.push(modifiers.multilineTextAlignment);
  }

  if (modifiers.padding) {
    // could have multiple lines for EdgeInsets or vertical/horizontal
    modifiers.padding.split("\n").forEach((p) => lines.push(p.trim()));
  }

  if (modifiers.frame) lines.push(modifiers.frame);

  if (!isTextElement && modifiers.foregroundStyle) {
    lines.push(modifiers.foregroundStyle);
  }

  if (modifiers.background) lines.push(modifiers.background);

  if (modifiers.clipShape) lines.push(modifiers.clipShape);

  if (modifiers.shadow) lines.push(modifiers.shadow);

  if (modifiers.opacity) lines.push(modifiers.opacity);

  return lines;
}
