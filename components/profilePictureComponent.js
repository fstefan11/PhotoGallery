"use client";

import { CldImage } from "next-cloudinary";
import { useState } from "react";
import Providers from "./providersComponent";
import UploadImage from "./cloudinaryUploadProfilePicComponent";
import Image from "next/image";

export default function ProfilePicture({ user, profilePicUrl }) {
  const [profilePic, setProfilePic] = useState(profilePicUrl);

  const handleProfilePicUpdate = (profilePicUrl) => {
    setProfilePic(profilePicUrl);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-96 h-96 overflow-hidden rounded-full border-4 border-gray-300 shadow-lg">
        {profilePic && (
          <img
            key={profilePic}
            src={profilePic}
            alt="Profile picture"
            crop="fill"
            width={500}
            height={500}
            className="object-cover w-full h-full"
          />
        )}
      </div>
      <div className="">
        <Providers>
          <UploadImage user={user} updateProfilePic={handleProfilePicUpdate}>
            Change profile picture
          </UploadImage>
        </Providers>
      </div>
    </div>
  );
}
