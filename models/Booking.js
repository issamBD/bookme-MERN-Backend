import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  calendar: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true },
  userInfo: Array,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Booking = mongoose.model("bookings", bookingSchema);

export default Booking;
