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
      type: String,
    },
  },
  { timestamps: true }
);

export const Photo =
  mongoose.models.Photo ?? mongoose.model("Photo", photoSchema);
