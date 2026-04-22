// Curated country list aligned with avatar regions. Order = priority:
// LATAM ES-first block at the top, then EN tier-1, then rest.
// See AVATAR-IDEAL.md for regional strategy.

export interface Country {
  code: string; // ISO-3166 alpha-2
  es: string;
  en: string;
  region: "latam" | "us-en" | "eu" | "apac" | "other";
}

export const COUNTRIES: Country[] = [
  // LATAM (primary)
  { code: "MX", es: "México", en: "Mexico", region: "latam" },
  { code: "CO", es: "Colombia", en: "Colombia", region: "latam" },
  { code: "AR", es: "Argentina", en: "Argentina", region: "latam" },
  { code: "BR", es: "Brasil", en: "Brazil", region: "latam" },
  { code: "CL", es: "Chile", en: "Chile", region: "latam" },
  { code: "PE", es: "Perú", en: "Peru", region: "latam" },
  { code: "UY", es: "Uruguay", en: "Uruguay", region: "latam" },
  { code: "CR", es: "Costa Rica", en: "Costa Rica", region: "latam" },
  { code: "EC", es: "Ecuador", en: "Ecuador", region: "latam" },
  { code: "ES", es: "España", en: "Spain", region: "latam" },
  // US/EN tier-1
  { code: "US", es: "Estados Unidos", en: "United States", region: "us-en" },
  { code: "CA", es: "Canadá", en: "Canada", region: "us-en" },
  { code: "UK", es: "Reino Unido", en: "United Kingdom", region: "us-en" },
  // EU
  { code: "DE", es: "Alemania", en: "Germany", region: "eu" },
  { code: "NL", es: "Países Bajos", en: "Netherlands", region: "eu" },
  { code: "DK", es: "Dinamarca", en: "Denmark", region: "eu" },
  { code: "SE", es: "Suecia", en: "Sweden", region: "eu" },
  { code: "FR", es: "Francia", en: "France", region: "eu" },
  { code: "CH", es: "Suiza", en: "Switzerland", region: "eu" },
  { code: "IE", es: "Irlanda", en: "Ireland", region: "eu" },
  // APAC
  { code: "IN", es: "India", en: "India", region: "apac" },
  { code: "SG", es: "Singapur", en: "Singapore", region: "apac" },
  { code: "AU", es: "Australia", en: "Australia", region: "apac" },
  { code: "JP", es: "Japón", en: "Japan", region: "apac" },
  { code: "KR", es: "Corea del Sur", en: "South Korea", region: "apac" },
  // Fallback
  { code: "OTHER", es: "Otro país", en: "Other country", region: "other" },
];
