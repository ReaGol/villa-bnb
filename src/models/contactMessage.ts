import mongoose, { Schema, models } from "mongoose";

const ContactMessageSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    phone: { type: String, required: true },
    preferredContactMethod: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.ContactMessage ||
  mongoose.model("ContactMessage", ContactMessageSchema);
