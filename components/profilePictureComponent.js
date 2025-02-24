"use client";

import { CldImage } from "next-cloudinary";

export default function ProfilePicture({ publicId }) {
  return (
    <div className="relative w-96 h-96">
      <CldImage
        src={publicId}
        alt="Profile picture"
        crop="fit"
        fill
        sizes="100vw"
      />
    </div>
  );
}
