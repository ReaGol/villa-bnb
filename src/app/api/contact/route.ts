import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import ContactMessage from "@/models/contactMessage";
import validator from "validator";
import { getContactSchema } from "@/validators/contactMessageSchema";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const locale = req.headers.get("accept-language")?.includes("he")
    ? "he"
    : "en";
  const contactSchema = getContactSchema(locale);

  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const parseResult = contactSchema.safeParse(data);

  if (!parseResult.success) {
    return NextResponse.json(
      {
        message:
          locale === "he" ? "שגיאה באימות הנתונים שנשלחו" : "Validation error",
        errors: parseResult.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const sanitizedData = {
    fullName: validator.escape(parseResult.data.fullName),
    email: validator.normalizeEmail(parseResult.data.email) || "",
    message: validator.escape(parseResult.data.message),
    phone: validator.escape(parseResult.data.phone),
    preferredContactMethod: parseResult.data.preferredContactMethod,
  };

  try {
    await ContactMessage.create(sanitizedData);
    // TODO: send email to admin
    return NextResponse.json({
      message:
        locale === "he" ? "ההודעה נשלחה בהצלחה" : "Message sent successfully",
    });
  } catch (error) {
    console.error("שגיאה בשליחת הודעה:", error);
    return NextResponse.json(
      { message: locale === "he" ? "שגיאה בשרת" : "Server error" },
      { status: 500 }
    );  }
}

export async function GET() {
  await connectToDatabase();

  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { message: "שגיאה בשליפת הודעות" },
      { status: 500 }
    );
  }
}
