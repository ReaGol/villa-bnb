import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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

    return NextResponse.json({ success: true, message: "התחברת בהצלחה!" });
  } catch (error) {
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}
