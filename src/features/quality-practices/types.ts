import { z } from "zod";
import { STORY_TAGS } from "@/features/refinement/types";

export const TEMPLATE_CATEGORIES = ["dod", "codeReview", "bugReport", "testStrategy", "release", "custom"] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  dod: "Definition of Done",
  codeReview: "Checklist de code review",
  bugReport: "Template de relato de bug",
  testStrategy: "Estratégia de teste",
  release: "Checklist de release",
  custom: "Personalizado",
};

export const checklistItemSchema = z.object({
  id: z.string(),
  text: z.string(),
});

export type ChecklistItem = z.infer<typeof checklistItemSchema>;

export const checklistTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(TEMPLATE_CATEGORIES),
  items: z.array(checklistItemSchema),
  isBuiltIn: z.boolean(),
  relatedTags: z.array(z.enum(STORY_TAGS)).optional(),
});

export type ChecklistTemplate = z.infer<typeof checklistTemplateSchema>;
