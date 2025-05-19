import { connectToDatabase } from "@/utils/db";
import Booking from "@/models/booking";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  try {
    const bookings = await Booking.find({}, "checkIn checkOut");

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      { message: "שגיאה בטעינת תאריכים לא זמינים" },
      { status: 500 }
    );
  }
}
