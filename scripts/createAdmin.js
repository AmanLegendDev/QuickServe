import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";

const MONGODB_URI = process.env.MONGODB_URI;

async function createAdmin() {

  try {

    if (!MONGODB_URI) {

      console.log(
        "❌ MONGODB_URI missing"
      );

      process.exit(1);
    }

    console.log(
      "⏳ Connecting MongoDB..."
    );

    await mongoose.connect(
      MONGODB_URI
    );

    // CHECK EXISTING
    const existing =
      await User.findOne({
        email:
          "admin@quickserve.com",
      });

    if (existing) {

      console.log(
        "⚠️ Admin already exists"
      );

      process.exit(0);
    }

    // HASH PASSWORD
    const password =
      await bcrypt.hash(
        "quickserve123",
        10
      );

    // CREATE ADMIN
    const admin =
      await User.create({
        name: "QuickServe Admin",
        email:
          "admin@quickserve.com",
        password,
        role: "admin",
      });

    console.log(
      "✅ ADMIN CREATED"
    );

    console.log({
      email: admin.email,
      role: admin.role,
    });

    process.exit(0);

  } catch (err) {

    console.log(
      "❌ ADMIN ERROR:",
      err
    );

    process.exit(1);
  }
}

createAdmin();