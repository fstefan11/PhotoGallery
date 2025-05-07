import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
  photoId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photo",
  },
  userId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Like = mongoose.models.Like ?? mongoose.model("Like", likeSchema);
