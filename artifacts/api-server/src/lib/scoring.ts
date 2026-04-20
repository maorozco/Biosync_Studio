// Server-side scoring — same rubric as the landing client (artifacts/landing/src/lib/scoring.ts).
// Re-runs server-side so clients cannot manipulate their tier.
// Source of truth: marketing/WAITLIST-FORM.md §3.

export type Role =
  | "pd-scientist"
  | "fermentation-engineer"
  | "research-associate"
  | "founder"
  | "cto"
  | "other";

export type Sector =
  | "precision-fermentation"
  | "vitamins"
  | "pigments"
  | "enzymes"
  | "bioplastics"
  | "probiotics"
  | "other-biomfg"
  | "academia"
  | "other";

export type Solution =
  | "excel"
  | "benchling"
  | "jmp"
  | "modde"
  | "simca"
  | "eln-notion"
  | "notebook-paper"
  | "dasware-eve-bioxpert"
  | "pioreactor-oss"
  | "other";

export type Timeline =
  | "this-week"
  | "2-4-weeks"
  | "1-3-months"
  | "3-plus"
  | "exploring";

export type CallIntent = "yes-calendly" | "yes-email-first" | "no-yet";

export interface ScoringInput {
  role: Role;
  country: string;
  sector: Sector;
  painText: string;
  solutions: Solution[];
  timeline: Timeline;
  callIntent: CallIntent;
}

export type Tier = "green" | "yellow" | "red";

export interface ScoringResult {
  score: number;
  tier: Tier;
}

const LATAM_ES = ["MX", "CO", "AR", "BR", "CL", "ES", "PE", "UY", "CR", "EC"];
const TIER_1_EN = ["US", "CA", "UK", "DE", "NL", "DK", "SE", "NO", "FI", "IE"];

const PAIN_KEYWORDS = [
  "ofat", "perder", "lote", "batch failed", "batch fail", "scale", "scale-up",
  "scaleup", "muestreo", "manual", "tribal", "knowledge", "benchling",
  "sartorius", "simca", "modde", "annex 22", "contamination", "contaminaci",
  "yield", "titer", "drift", "deriva", "pilot", "shake flask",
];

export function computeScore(input: ScoringInput): ScoringResult {
  let score = 0;

  if (input.role === "pd-scientist" || input.role === "fermentation-engineer") score += 3;
  else if (input.role === "founder" || input.role === "cto") score += 2;
  else if (input.role === "research-associate") score += 1;

  if (LATAM_ES.includes(input.country)) score += 2;
  else if (TIER_1_EN.includes(input.country)) score += 1;

  const premium: Sector[] = [
    "precision-fermentation", "vitamins", "pigments",
    "enzymes", "bioplastics", "probiotics",
  ];
  if (premium.includes(input.sector)) score += 3;
  else if (input.sector === "other-biomfg") score += 1;
  else if (input.sector === "academia") score -= 2;

  const painLower = input.painText.toLowerCase();
  const hits = PAIN_KEYWORDS.filter((k) => painLower.includes(k)).length;
  score += Math.min(hits, 3);

  if (input.solutions.includes("benchling")) score += 2;
  if (input.solutions.includes("simca") || input.solutions.includes("modde")) score += 2;
  if (input.solutions.length === 1 && input.solutions[0] === "excel") score += 1;
  if (input.solutions.includes("notebook-paper")) score -= 1;

  if (input.timeline === "this-week") score += 4;
  else if (input.timeline === "2-4-weeks") score += 3;
  else if (input.timeline === "1-3-months") score += 1;

  if (input.callIntent === "yes-calendly") score += 3;
  else if (input.callIntent === "yes-email-first") score += 1;

  const tier: Tier = score >= 12 ? "green" : score >= 6 ? "yellow" : "red";
  return { score, tier };
}
