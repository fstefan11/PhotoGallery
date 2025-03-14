"use server";

import { User } from "@/model/user-model";
import { deleteImageFromCloudinary } from "./cloudinaryActions";
import { dbConnect } from "../mongo";

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
      return user;
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
