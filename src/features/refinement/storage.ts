import { z } from "zod";
import { getItem, setItem } from "@/lib/storage";
import { questionBankEntrySchema, refinementSessionSchema, type QuestionBankEntry, type RefinementSession } from "./types";

const SESSIONS_KEY = "refinement-sessions";
const CUSTOM_QUESTIONS_KEY = "refinement-custom-questions";

export const refinementSessionsSchema = z.array(refinementSessionSchema);
export const customQuestionsSchema = z.array(questionBankEntrySchema);

export function loadSessions(): RefinementSession[] {
  return getItem<RefinementSession[]>(SESSIONS_KEY, []);
}

export function saveSessions(sessions: RefinementSession[]): void {
  setItem(SESSIONS_KEY, sessions);
}

export function loadCustomQuestions(): QuestionBankEntry[] {
  return getItem<QuestionBankEntry[]>(CUSTOM_QUESTIONS_KEY, []);
}

export function saveCustomQuestions(questions: QuestionBankEntry[]): void {
  setItem(CUSTOM_QUESTIONS_KEY, questions);
}

export const refinementBackupEntries = [
  { key: SESSIONS_KEY, schema: refinementSessionsSchema },
  { key: CUSTOM_QUESTIONS_KEY, schema: customQuestionsSchema },
];
