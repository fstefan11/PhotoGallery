import mongoose, { Schema } from "mongoose";

const photoSchema = new Schema(
  {
    url: {
      required: true,
      type: String,
    },
    publicId: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
    description: {
      required: false,
      type: String,
    },
    userId: {
      required: true,
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
    },
    isPublic: {
      required: true,
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Photo =
  mongoose.models.Photo ?? mongoose.model("Photo", photoSchema);
