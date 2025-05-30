import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stars: { type: Number, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Recommendation ||
  mongoose.model("Recommendation", recommendationSchema);
