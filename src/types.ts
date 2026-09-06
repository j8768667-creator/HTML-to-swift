export type TargetFormat = "playgrounds-app" | "playground-page" | "swiftui-view";

export type SwiftVersion = "swift6" | "swift5";

export interface ConversionOptions {
  target: TargetFormat;
  swiftVersion: SwiftVersion;
  autoDetectState: boolean;
  mapSFSymbols: boolean;
  wrapInScrollView: boolean;
  useObservableMacro: boolean;
  includePreview: boolean;
  indentSize: number;
}

export interface StateVariable {
  name: string;
  type: "String" | "Bool" | "Double" | "Int";
  defaultValue: string;
  sourceElement: string;
}

export interface ConversionDiagnostics {
  elementsProcessed: number;
  stateVarsCount: number;
  depth: number;
  processingTimeMs: number;
  warnings: string[];
}

export interface ConversionResult {
  swiftCode: string;
  stateVariables: StateVariable[];
  diagnostics: ConversionDiagnostics;
  isAiGenerated?: boolean;
}

export interface PresetTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
  html: string;
}
