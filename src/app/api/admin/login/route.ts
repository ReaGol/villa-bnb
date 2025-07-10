import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "@/models/Admin";
import { connectToDatabase } from "@/utils/db";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
      return NextResponse.json(
        { error: "אימייל או סיסמה שגויים" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "אימייל או סיסמה שגויים" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { email: existingAdmin.email, role: "admin" },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    );

    const response = NextResponse.json({
      success: true,
      message: "התחברת בהצלחה!",
    });
    response.cookies.set({
      name: "adminToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 2, 
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}
