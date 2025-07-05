import { z } from "zod";
import { getValidationMessages } from "@/utils/getValidationMessages";

export function getRecommendationSchema(locale: string) {
  const messages = getValidationMessages(locale);

  return z.object({
    name: z
      .string()
      .min(2, messages.fullNameRequired) // לפחות 2 תווים
      .max(100),
    stars: z.number().min(1, messages.starsRequired).max(5),
    message: z
      .object({
        he: z.string().min(5, messages.messageRequired).max(1000).optional(),
        en: z.string().min(5, messages.messageRequired).max(1000).optional(),
      })
      .refine(
        (msg) =>
          (msg.he && msg.he.length >= 5) || (msg.en && msg.en.length >= 5),
        {
          message: messages.messageRequired,
        }
      ),
  });
}
