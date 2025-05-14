import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Admin } from "@/models/Admin";
import { connectToDatabase } from "@/utils/db";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();

    const existing = await Admin.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashed });
    await newAdmin.save();

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}
