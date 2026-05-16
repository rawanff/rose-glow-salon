import express from "express";
import cors from "cors";
import crypto from "crypto";

import connectDB from "./backend/db.js";
import User from "./backend/models/User.js";
import Booking from "./backend/models/Booking.js";

const PORT = process.env.PORT || 4000;

const app = express();

connectDB();

app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://127.0.0.1:8080",
      "http://localhost:5173",
    ],
  })
);

app.use(express.json());

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

const specialistsByService = {
  makeup: "ragad",
  hair: "razan",
  nails: "rawan",
};

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    message: "Rose Glow backend is running",
  });
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "جميع الحقول مطلوبة",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    });
  }

  const exists = await User.findOne({
    email: email.toLowerCase(),
  });

  if (exists) {
    return res.status(409).json({
      message: "هذا الإيميل مسجل مسبقاً",
    });
  }

  const user = await User.create({
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: hashPassword(password),
    createdAt: new Date(),
  });

  res.status(201).json({
    user: publicUser(user),
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: String(email || "").toLowerCase(),
  });

  if (!user || user.passwordHash !== hashPassword(password  ||"")) {
    return res.status(401).json({
      message: "الإيميل أو كلمة المرور غير صحيحة",
    });
  }

  res.json({
    user: publicUser(user),
  });
});

app.get("/api/bookings", async (req, res) => {
  const userEmail = String(req.query.userEmail || "").toLowerCase();

  if (!userEmail) {
    return res.status(400).json({
      message: "userEmail مطلوب",
    });
  }

  const bookings = await Booking.find({
    userEmail,
  }).sort({
    date: -1,
    time: -1,
  });

  res.json({
    bookings,
  });
});

app.post("/api/bookings", async (req, res) => {
  const { userEmail, service, date, time, payment } = req.body;

  if (!userEmail || !service || !date || !time || !payment) {
    return res.status(400).json({
      message: "بيانات الحجز غير مكتملة",
    });
  }

  const specialist = specialistsByService[service];

  if (!specialist) {
    return res.status(400).json({
      message: "الخدمة غير صحيحة",
    });
  }

  const conflict = await Booking.findOne({
    specialist,
    date,
    time,
  });

  if (conflict) {
    return res.status(409).json({
      message: "هذا الموعد محجوز مسبقاً مع نفس الأخصائية",
    });
  }

  const booking = await Booking.create({
    id: crypto.randomUUID(),
    userEmail: userEmail.toLowerCase(),
    service,
    specialist,
    date,
    time,
    payment,
    reminderStatus: "scheduled-demo",
    createdAt: new Date(),
  });

  console.log(
   `Reminder demo: email reminder will be sent to ${booking.userEmail} for ${booking.date} ${booking.time}`
  );

  res.status(201).json({
    booking,
  });
});

app.delete("/api/bookings/:id", async (req, res) => {
  const deletedBooking = await Booking.findOneAndDelete({
    id: req.params.id,
  });

  if (!deletedBooking) {
    return res.status(404).json({
      message: "الحجز غير موجود",
    });
  }

  res.json({
    ok: true,
  });
});

app.listen(PORT, () => {
  console.log(`Rose Glow backend running on http://localhost:${PORT}`);
});