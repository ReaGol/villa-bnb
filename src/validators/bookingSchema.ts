import { z } from "zod";
import { getValidationMessages } from "../utils/getValidationMessages";

export function getGuestBookingSchema(locale: string) {
  const messages = getValidationMessages(locale);

  return z.object({
    fullName: z.string().min(1, messages.fullNameRequired).max(100),
    email: z.string().email(messages.invalidEmail),
    phone: z.string().min(5, messages.phoneRequired).max(20),
    checkIn: z.string().datetime(messages.dateRangeRequired),
    checkOut: z.string().datetime(messages.dateRangeRequired),
    adults: z.number().min(1, messages.minAdults).max(20),
    children: z.number().min(0, messages.childrenRequired).max(20),
    specialRequests: z.string().max(1000).optional(),
    createdBy: z.literal("guest").optional(),
  });
}
