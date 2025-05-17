import mongoose, { Schema, Document, models } from "mongoose";

export interface Booking extends Document {
  fullName: string;
  email: string;
  phone: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  specialRequests?: string;
  createdAt: Date;
}

const BookingSchema = new Schema<Booking>({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  adults: { type: Number, required: true, min: 1 },
  children: { type: Number, required: true, min: 0 },
  specialRequests: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default models.Booking ||
  mongoose.model<Booking>("Booking", BookingSchema);
