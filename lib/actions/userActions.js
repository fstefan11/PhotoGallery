"use server";

import { User } from "@/model/user-model";
import { deleteImageFromCloudinary } from "./cloudinaryActions";
import { dbConnect } from "../mongo";

export async function getProfilePic(userName) {
  dbConnect();
  const user = await User.findOne({ userName: userName });
  if (user) {
    return user.profilePic;
  }
}

export async function setProfilePic(userName, url) {
  dbConnect();
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
