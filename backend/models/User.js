import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  passwordHash: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);