import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import Booking from "@/models/booking";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const data = await request.json();

    const {
      fullName,
      email,
      phone,
      checkIn,
      checkOut,
      adults,
      children,
      specialRequests,
      createdBy = "guest",
    } = data;

    if (
      !fullName ||
      !email ||
      !phone ||
      !checkIn ||
      !checkOut ||
      !adults ||
      children === undefined
    ) {
      return NextResponse.json({ message: "שדות חובה חסרים" }, { status: 400 });
    }

    if (adults < 1) {
      return NextResponse.json(
        { message: "לפחות מבוגר אחד נדרש" },
        { status: 400 }
      );
    }

    const existingBookings = await Booking.find();
    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);

    const hasConflict = existingBookings.some((booking) => {
      const existingCheckIn = new Date(booking.checkIn);
      const existingCheckOut = new Date(booking.checkOut);
      return newCheckIn <= existingCheckOut && newCheckOut >= existingCheckIn;
    });

    if (hasConflict) {
      return NextResponse.json(
        { message: "יש חפיפה עם הזמנה קיימת" },
        { status: 409 }
      );
    }

    const newBooking = new Booking({
      fullName,
      email,
      phone,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      adults,
      children,
      specialRequests,
      createdBy,
    });

    await newBooking.save();

    return NextResponse.json(
      { message: "ההזמנה התקבלה בהצלחה" },
      { status: 201 }
    );
  } catch (error) {
    console.error("שגיאה בהוספת הזמנה:", error);
    return NextResponse.json({ message: "שגיאה בשרת" }, { status: 500 });
  }
}
