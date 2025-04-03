"use server";

import { Photo } from "@/model/photo-model";
import { uploadToCloudinary } from "./cloudinaryActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "../mongo";
import { getUserByUsername } from "./userActions";
import cloudinary from "../cloudinary";
import { postSchema } from "../validationSchema";

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

export async function deleteImageById(id) {
  try {
    await dbConnect();

    const image = await Photo.findById(id);
    const response = await cloudinary.uploader.destroy(image.publicId);
    if (response.result === "ok") {
      const deletedImage = await Photo.findByIdAndDelete(id);

      if (!deletedImage) {
        return {
          success: false,
          message: "Photo not found",
        };
      }

      return {
        success: true,
        message: "Photo deleted successfully",
      };
    } else {
      return {
        success: false,
        message: "Failed to delete photo",
        error: "Failed to delete photo in Cloudinary",
      };
    }
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "Failed to delete photo",
      error: e.message || "Unknown error",
    };
  }
}

export async function editImageById(id, formData) {
  try {
    postSchema.parse({
      title: formData.title,
      description: formData.description,
    });
    await dbConnect();
    const image = await Photo.findById(id);
    if (!image) {
      return {
        success: false,
        message: "Image not found",
      };
    }
    if (formData.title) image.title = formData.title;
    if (formData.description) image.description = formData.description;
    const updatedImage = await Photo.findByIdAndUpdate(id, image, {
      new: true,
      runValidators: true,
    }).lean();
    updatedImage._id = updatedImage._id.toString();
    return {
      success: true,
      message: "Image updated successfully",
      image: updatedImage,
    };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodErrors) {
      const errors = e.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      return {
        success: false,
        message: errors,
      };
    }
    return {
      success: false,
      message: "Failed to edit Post",
      error: e.message,
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

export async function getPhotos() {
  try {
    await dbConnect();
    const images = await Photo.find().populate("userId", "userName profilePic");
    return {
      success: true,
      images: JSON.parse(JSON.stringify(images)),
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal Server Error",
      statusCode: 500,
    };
  }
}
