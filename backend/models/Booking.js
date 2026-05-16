import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  id: String,
  userEmail: String,
  service: String,
  specialist: String,
  date: String,
  time: String,
  payment: String,
  reminderStatus: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Booking", bookingSchema);