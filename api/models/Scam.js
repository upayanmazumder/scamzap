import mongoose from "mongoose";

const ScamSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: String,
  description: String,
  category: String,
  submittedBy: { type: String, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Scam = mongoose.model("Scam", ScamSchema);
export default Scam;
