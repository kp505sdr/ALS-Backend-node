import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  answer: {
    type: String,
  },
});

export default mongoose.model("FAQ", faqSchema);
