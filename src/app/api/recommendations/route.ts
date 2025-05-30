import { connectToDatabase } from "@/utils/db";
import Recommendation from "@/models/recommendation";
import { NextResponse } from "next/server";

await connectToDatabase();

export async function GET() {
  try {
    const recs = await Recommendation.find().sort({ createdAt: -1 });
    return NextResponse.json(recs);
  } catch (err) {
    return NextResponse.json(
      { message: "שגיאה בשליפת המלצות" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, stars, message } = body;

    if (!name || !stars || !message) {
      return NextResponse.json({ message: "שדות חסרים" }, { status: 400 });
    }

    const newRec = new Recommendation({ name, stars, message });
    await newRec.save();

    return NextResponse.json({ message: "ההמלצה נשמרה" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "שגיאה בשרת" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "לא סופק מזהה" }, { status: 400 });
  }

  try {
    await Recommendation.findByIdAndDelete(id);
    return NextResponse.json({ message: "ההמלצה נמחקה" });
  } catch (err) {
    return NextResponse.json({ message: "שגיאה במחיקה" }, { status: 500 });
  }
}
