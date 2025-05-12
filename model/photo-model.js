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
    albumId: {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },
  },
  { timestamps: true }
);

photoSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "photoId",
  justOne: false,
});

photoSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "photoId",
  justOne: false,
});

photoSchema.set("toJSON", { virtuals: true });

export const Photo =
  mongoose.models.Photo ?? mongoose.model("Photo", photoSchema);
