import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import Recommendation from "@/models/recommendation";
import validator from "validator";
import { getRecommendationSchema } from "@/validators/recommendationSchema";

export async function GET(req: NextRequest) {
  await connectToDatabase();

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
    console.error("Error fetching recommendations:", err);
    return NextResponse.json(
      { message: "שגיאה בשליפת המלצות" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const locale = req.headers.get("accept-language")?.includes("he")
    ? "he"
    : "en";
  const recommendationSchema = getRecommendationSchema(locale);

  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const parseResult = recommendationSchema.safeParse(data);

  if (!parseResult.success) {
    return NextResponse.json(
      {
        message: "Validation error",
        errors: parseResult.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const sanitizedData = {
    name: validator.escape(parseResult.data.name),
    stars: parseResult.data.stars,
    message: {
      he: parseResult.data.message.he
        ? validator.escape(parseResult.data.message.he)
        : "",
      en: parseResult.data.message.en
        ? validator.escape(parseResult.data.message.en)
        : "",
    },
  };

  try {
    const newRec = new Recommendation(sanitizedData);
    await newRec.save();

    return NextResponse.json(
      {
        message:
          locale === "he"
            ? "ההמלצה נשמרה בהצלחה"
            : "Recommendation saved successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error saving recommendation:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectToDatabase();

  const locale = req.headers.get("accept-language")?.includes("he")
    ? "he"
    : "en";
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      {
        message: locale === "he" ? "לא סופק מזהה" : "No ID provided",
      },
      { status: 400 }
    );
  }

  try {
    await Recommendation.findByIdAndDelete(id);
    return NextResponse.json({
      message:
        locale === "he"
          ? "ההמלצה נמחקה בהצלחה"
          : "Recommendation deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting recommendation:", err);
    return NextResponse.json(
      {
        message:
          locale === "he"
            ? "שגיאה במחיקת המלצה"
            : "Error deleting recommendation",
      },
      { status: 500 }
    );
  }
}
