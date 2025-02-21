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
      required: true,
      type: String,
      default:
        "https://res.cloudinary.com/dlx12oci6/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1740140877/blank-profile-picture-973460_1280_hpkm8e.webp",
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User ?? mongoose.model("User", userSchema);
