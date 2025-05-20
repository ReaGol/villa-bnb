import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import ContactMessage from "@/models/contactMessage";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { fullName, email, message, phone, preferredContactMethod } =
    await req.json();

  if (!fullName || !email || !message || !phone || !preferredContactMethod) {
    return NextResponse.json({ message: "שדות חובה חסרים" }, { status: 400 });
  }

  try {
    await ContactMessage.create({ fullName, email, message, phone, preferredContactMethod });
    // TODO: send email to admin
    return NextResponse.json({ message: "ההודעה נשלחה בהצלחה" });
  } catch (error) {
    console.error("שגיאה בשליחת הודעה:", error);
    return NextResponse.json({ message: "שגיאה בשרת" }, { status: 500 });
  }
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
