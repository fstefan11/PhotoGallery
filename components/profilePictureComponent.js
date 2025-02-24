"use client";

import { CldImage } from "next-cloudinary";

export default function ProfilePicture({ publicId }) {
  return (
    <div className="relative w-[600px]">
      {/* <CldImage
        src={publicId}
        alt="Profile picture"
        crop="fill"
        fill
        sizes="100vw"
      /> */}
      <img src={publicId}></img>
    </div>
  );
}
