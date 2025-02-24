import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      required: true,
      unique: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      unique: true,
      type: String,
    },
    role: {
      required: true,
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePic: {
      required: false,
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User ?? mongoose.model("User", userSchema);
