"use server";

import { Photo } from "@/model/photo-model";
import { uploadToCloudinary } from "./cloudinaryActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "../mongo";
import { getUserByUsername } from "./userActions";
import cloudinary from "../cloudinary";

export async function addPhoto(formData) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const response = await uploadToCloudinary(formData);
    const newPhoto = new Photo({
      url: response.secure_url,
      publicId: response.public_id,
      title: formData.get("title"),
      description: formData.get("description"),
      userId: session.user.id,
      isPublic: formData.get("private") === "on" ? false : true,
    });
    try {
      await newPhoto.save();
    } catch (error) {
      await cloudinary.uploader.destroy(response.public_id);
      return {
        success: false,
        message: "Failed to upload photo",
        error: e.message || "Unknown error",
      };
    }

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

export async function getPhotosByUsername(username) {
  try {
    await dbConnect();
    const user = await getUserByUsername(username);
    if (!user) {
      throw new Error("User not found");
    }
    const photos = await Photo.find({ userId: user.id });
    return photos;
  } catch (error) {
    console.error("Error on getting photos by username : ", error);
  }
}

export async function getPhotoById(id) {
  try {
    await dbConnect();
    const image = await Photo.findById(id);
    if (!image)
      return { success: false, message: "Photo not found", statusCode: 404 };
    return { success: true, image: JSON.parse(JSON.stringify(image)) };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal Server Error",
      statusCode: 500,
    };
  }
}
