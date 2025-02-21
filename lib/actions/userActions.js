"use server";

import { User } from "@/model/user-model";

export async function getProfilePic(username) {
  const user = await User.findOne({ username: username });
  if (user) {
    return user.profilePic;
  }
}

export async function setProfilePic(username, url) {
  const user = await User.findOne({ username: username });
  if (user) {
    user.profilePic = url;
    await user.save();
    return { message: "Profile picture update succesfully." };
  } else {
    return { error: "User not found" };
  }
}
