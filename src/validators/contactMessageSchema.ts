import { z } from "zod";
import { getValidationMessages } from "@/utils/getValidationMessages";

export function getContactSchema(locale: string) {
  const messages = getValidationMessages(locale);

  return z.object({
    fullName: z.string().min(1, messages.fullNameRequired).max(100),
    email: z.string().email(messages.invalidEmail),
    phone: z.string().min(5, messages.phoneRequired).max(20),
    message: z.string().min(1, messages.messageRequired).max(1000),
    preferredContactMethod: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.enum(["phone", "email"], {
        required_error: messages.preferredContactMethodRequired,
      })
    ),
  });
}
