import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://rawan123456:rawan123456@cluster0.s0bqyzc.mongodb.net/?appName=Cluster0");
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("MongoDB Error:", err.message);
  }
};

export default connectDB;