import { connectToDatabase } from "@/utils/db";  
import Booking from "@/models/booking";
import { NextResponse } from "next/server";

await connectToDatabase();

export async function GET() {
  try {
    const bookings = await Booking.find().sort({ checkIn: 1 });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      { message: "שגיאה בשליפת ההזמנות" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "חסר מזהה הזמנה" }, { status: 400 });
  }

  try {
    await Booking.findByIdAndDelete(id);
    return NextResponse.json({ message: "ההזמנה נמחקה" });
  } catch (error) {
    return NextResponse.json({ message: "שגיאה במחיקה" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { checkIn, checkOut } = data;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);

    if (
      isNaN(newCheckIn.getTime()) ||
      isNaN(newCheckOut.getTime()) ||
      newCheckIn < today ||
      newCheckOut < today
    ) {
      return NextResponse.json(
        { message: "לא ניתן להזין תאריך עבר" },
        { status: 400 }
      );
    }

    if (newCheckIn > newCheckOut) {
      return NextResponse.json(
        { message: "תאריך כניסה חייב להיות מוקדם מתאריך יציאה" },
        { status: 400 }
      );
    }

    const bookings = await Booking.find();
    const hasConflict = bookings.some((existing) => {
      return newCheckIn <= existing.checkOut && newCheckOut >= existing.checkIn;
    });

    if (hasConflict) {
      return NextResponse.json(
        { message: "יש חפיפה עם הזמנה קיימת" },
        { status: 409 }
      );
    }

    const newBooking = new Booking(data);
    await newBooking.save();

    return NextResponse.json(
      { message: "ההזמנה נוספה בהצלחה" },
      { status: 201 }
    );
  } catch (error) {
    console.error("שגיאה ביצירת ההזמנה:", error);
    return NextResponse.json(
      { message: "שגיאה ביצירת ההזמנה, נסו שוב" },
      { status: 500 }
    );
  }
}

