import en from "@/messages/en.json";
import he from "@/messages/he.json";

export function getValidationMessages(locale: string) {
  return locale === "he" ? he.validation : en.validation;
}
