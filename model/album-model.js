import mongoose, { Schema } from "mongoose";

const albumSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  description: {
    required: false,
    type: String,
  },
  userId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Album =
  mongoose.models.Album ?? mongoose.model("Album", albumSchema);
