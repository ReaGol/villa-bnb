import { connectToDatabase } from "@/utils/db";
import Recommendation from "@/models/recommendation";
import { NextResponse } from "next/server";

await connectToDatabase();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lang = url.searchParams.get("lang") || "he";

    const recs = await Recommendation.find().sort({ createdAt: -1 });

    const translatedRecs = recs.map((rec) => ({
      _id: rec._id,
      name: rec.name,
      stars: rec.stars,
      message: rec.message, 
      createdAt: rec.createdAt,
    }));

    return NextResponse.json(translatedRecs);
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

    if (
      !name ||
      !stars ||
      !message ||
      typeof message !== "object" ||
      (!message.he && !message.en)
    ) {
      return NextResponse.json({ message: "שדות חסרים" }, { status: 400 });
    }

    const safeMessage = {
      he: message.he || "",
      en: message.en || ""
    };

    const newRec = new Recommendation({ name, stars, message: safeMessage });
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
