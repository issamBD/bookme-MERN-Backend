import mongoose from "mongoose";

const toolSchema = new mongoose.Schema({
  username: { type: String, required: true },
  user_id: { type: String, required: true },
  name: String,
  durations: Array,
  periods: Array,
  hours: Array,
  questions: Array,
  bookings: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Tool = mongoose.model("Tool", toolSchema);

export default Tool;
