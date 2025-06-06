"use server";

import { User } from "@/model/user-model";
import { deleteImageFromCloudinary } from "./cloudinaryActions";
import { dbConnect } from "../mongo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { deleteImageById } from "./photoActions";
import { Photo } from "@/model/photo-model";
import { Album } from "@/model/album-model";
import { Like } from "@/model/like-model";
import { Comment } from "@/model/comment-model";

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        success: false,
        message: "You are not logged in",
        statusCode: 403,
      };
    }
    return {
      success: true,
      user: session.user,
      statusCode: 200,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Internal server error",
      statusCode: 500,
    };
  }
}

export async function getUserById(id) {
  try {
    await dbConnect();
    const user = await User.findById(id);
    if (!user) return { message: "User not found" };
    return JSON.parse(JSON.stringify(user));
  } catch (e) {
    console.error(e);
  }
}

export async function getUserByUsername(userName) {
  try {
    await dbConnect();
    const user = await User.findOne({ userName: userName });
    if (user) {
      return {
        success: true,
        user: JSON.parse(JSON.stringify(user)),
        statusCode: 200,
      };
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getProfilePic(userName) {
  await dbConnect();
  const user = await User.findOne({ userName: userName });
  if (user) {
    return user.profilePic;
  }
}

export async function setProfilePic(userName, url) {
  await dbConnect();
  try {
    const user = await User.findOne({ userName: userName });
    if (user) {
      if (user.profilePic) {
        const response = await deleteImageFromCloudinary(user.profilePic);
      }
      user.profilePic = url;
      await user.save();
      return { message: "Profile picture update succesfully." };
    } else {
      return { error: "User not found" };
    }
  } catch (e) {
    console.error(e);
  }
}

export async function getUsers() {
  try {
    await dbConnect();
    const users = await User.find({ role: "user" }).lean();
    return {
      success: true,
      users: JSON.parse(JSON.stringify(users)),
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      statusCode: 500,
    };
  }
}

export async function deleteUserById(id) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role != "admin") {
      return {
        success: false,
        message: "Access forbidden",
        statusCode: 403,
      };
    }
    const user = await User.findById(id);
    await deleteImageFromCloudinary(user.profilePic);
    const photos = await Photo.find({ userId: id });
    await Promise.all(
      photos.map((photo) => {
        deleteImageById(photo._id.toString());
      })
    );

    await Like.deleteMany({ userId: id });
    await Comment.deleteMany({ userId: id });
    await Album.deleteMany({ userId: id });
    await User.deleteOne({ _id: id });
    return {
      success: true,
      message: "User deleted",
      statusCode: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal server error",
      statusCode: 500,
    };
  }
}
