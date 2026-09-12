import { z } from "zod";
import { getItem, setItem } from "@/lib/storage";
import { testCaseSchema, type TestCase } from "./types";

const KEY = "test-cases";
export const testCasesSchema = z.array(testCaseSchema);

export function loadTestCases(): TestCase[] {
  return getItem<TestCase[]>(KEY, []);
}

export function saveTestCases(testCases: TestCase[]): void {
  setItem(KEY, testCases);
}

export const testBuilderBackupEntry = { key: KEY, schema: testCasesSchema };
