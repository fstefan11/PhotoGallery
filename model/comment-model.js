import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
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
  text: {
    required: true,
    type: String,
  },
});

export const Comment =
  mongoose.models.Comment ?? mongoose.model("Comment", commentSchema);
