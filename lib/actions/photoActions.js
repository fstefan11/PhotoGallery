"use server";

import { Photo } from "@/model/photo-model";
import { uploadToCloudinary } from "./cloudinaryActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "../mongo";

export async function addPhoto(formData) {
  try {
    const session = await getServerSession(authOptions);
    const response = await uploadToCloudinary(formData);
    dbConnect();
    const newPhoto = new Photo({
      url: response.secure_url,
      publicId: response.public_id,
      title: formData.get("title"),
      description: formData.get("description"),
      userId: session.user.id,
    });
    await newPhoto.save();

    return {
      success: true,
      message: "Photo uploaded succesfully",
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "Failed to upload photo",
      error: e.message || "Unknown error",
    };
  }
}
