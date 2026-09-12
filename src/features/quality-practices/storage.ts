import { z } from "zod";
import { getItem, setItem } from "@/lib/storage";
import { checklistTemplateSchema, type ChecklistTemplate } from "./types";
import { BUILT_IN_TEMPLATES } from "./templates-seed";

const KEY = "checklist-templates";
export const checklistTemplatesSchema = z.array(checklistTemplateSchema);

export function loadTemplates(): ChecklistTemplate[] {
  return getItem<ChecklistTemplate[]>(KEY, BUILT_IN_TEMPLATES);
}

export function saveTemplates(templates: ChecklistTemplate[]): void {
  setItem(KEY, templates);
}

export const qualityPracticesBackupEntry = { key: KEY, schema: checklistTemplatesSchema };
