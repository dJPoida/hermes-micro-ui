export interface BrandConfig {
  productName: string;
  assistantName: string;
  tagline: string;
  avatarGlyph: string;
  surface: string;
  surfaceMuted: string;
  primary: string;
  primarySoft: string;
  accent: string;
}

const FALLBACK_BRAND: BrandConfig = {
  productName: "Hermes Micro UI",
  assistantName: "Hermes",
  tagline: "Ephemeral task interfaces for human-in-the-loop workflows.",
  avatarGlyph: "◉",
  surface: "#111827",
  surfaceMuted: "#1f2937",
  primary: "#6d28d9",
  primarySoft: "#ede9fe",
  accent: "#22c55e",
};

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getBrandConfig(): BrandConfig {
  return {
    productName:
      readEnv("NEXT_PUBLIC_MICRO_UI_NAME") ?? FALLBACK_BRAND.productName,
    assistantName:
      readEnv("NEXT_PUBLIC_ASSISTANT_NAME") ??
      readEnv("NEXT_PUBLIC_MICRO_UI_NAME") ??
      FALLBACK_BRAND.assistantName,
    tagline:
      readEnv("NEXT_PUBLIC_MICRO_UI_TAGLINE") ?? FALLBACK_BRAND.tagline,
    avatarGlyph:
      readEnv("NEXT_PUBLIC_MICRO_UI_AVATAR_GLYPH") ??
      FALLBACK_BRAND.avatarGlyph,
    surface:
      readEnv("NEXT_PUBLIC_MICRO_UI_SURFACE") ?? FALLBACK_BRAND.surface,
    surfaceMuted:
      readEnv("NEXT_PUBLIC_MICRO_UI_SURFACE_MUTED") ??
      FALLBACK_BRAND.surfaceMuted,
    primary:
      readEnv("NEXT_PUBLIC_MICRO_UI_PRIMARY") ?? FALLBACK_BRAND.primary,
    primarySoft:
      readEnv("NEXT_PUBLIC_MICRO_UI_PRIMARY_SOFT") ??
      FALLBACK_BRAND.primarySoft,
    accent: readEnv("NEXT_PUBLIC_MICRO_UI_ACCENT") ?? FALLBACK_BRAND.accent,
  };
}
