import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import Booking from "@/models/booking";
import validator from "validator";
import { getGuestBookingSchema } from "@/validators/bookingSchema";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const locale = request.headers.get("accept-language")?.includes("he")
      ? "he"
      : "en";
    const bookingSchema = getGuestBookingSchema(locale);

    let data;
    try {
      data = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }

    const parseResult = bookingSchema.safeParse(data);

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
      ...parseResult.data,
      fullName: validator.escape(parseResult.data.fullName),
      email: validator.normalizeEmail(parseResult.data.email) || "",
      phone: validator.escape(parseResult.data.phone),
      specialRequests: parseResult.data.specialRequests
        ? validator.escape(parseResult.data.specialRequests)
        : undefined,
    };

    const newCheckIn = new Date(sanitizedData.checkIn);
    const newCheckOut = new Date(sanitizedData.checkOut);

    const existingBookings = await Booking.find();

    const hasConflict = existingBookings.some((booking) => {
      const existingCheckIn = new Date(booking.checkIn);
      const existingCheckOut = new Date(booking.checkOut);
      return newCheckIn <= existingCheckOut && newCheckOut >= existingCheckIn;
    });

    if (hasConflict) {
      return NextResponse.json(
        {
          message:
            locale === "he"
              ? "יש חפיפה עם הזמנה קיימת"
              : "Booking dates conflict with an existing booking",
        },
        { status: 409 }
      );
    }

    const newBooking = new Booking({
      ...sanitizedData,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
    });

    await newBooking.save();

    return NextResponse.json(
      {
        message:
          locale === "he"
            ? "ההזמנה התקבלה בהצלחה"
            : "Booking received successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("שגיאה בהוספת הזמנה:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
