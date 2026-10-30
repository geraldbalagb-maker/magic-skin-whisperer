import { ME22_CONCERNS } from "@/lib/me22Analysis";
import { BUDGET_OPTIONS } from "../../../supabase/functions/_shared/me22Budget";

export interface QuizData {
  name: string;
  selfie: string | null;
  age: string;
  time: string;
  skinDescription: string;
  skinGoals: string[];
  currentProducts: string[];
  budget: string;
  /** Raw ME-22 /v1/analyze output, produced right after the photo upload. */
  me22Analysis: Record<string, unknown> | null;
}

export const EMPTY_QUIZ: QuizData = {
  name: "",
  selfie: null,
  age: "",
  time: "",
  skinDescription: "",
  skinGoals: [],
  currentProducts: [],
  budget: "",
  me22Analysis: null,
};

export const stepVariants = {
  enter: { opacity: 0, y: 30, filter: "blur(6px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -30, filter: "blur(6px)" },
};

// skinGoals holds ME-22 concern categories, pre-filled from the photo analysis.
export const skinGoalsOptions: readonly string[] = ME22_CONCERNS;

export const productOptions = [
  "Detergente",
  "Tonico",
  "Siero",
  "Crema viso",
  "Crema contorno occhi",
  "Maschera",
  "Scrub / Esfoliante",
  "Protezione solare (SPF)",
];

export const budgetOptions: readonly string[] = BUDGET_OPTIONS;
export const timeOptions = ["5 minuti", "10 minuti", "20 minuti", "30+ minuti"];

export const TOTAL_STEPS = 8; // 0..7
