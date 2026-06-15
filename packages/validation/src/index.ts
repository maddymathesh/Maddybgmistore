import { z } from "zod";

export const feedbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  stars: z.number().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
  desiredItems: z.string().optional(),
  phone: z.string().optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
