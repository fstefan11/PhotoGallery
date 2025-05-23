"use client";

import { setProfilePic } from "@/lib/actions/userActions";

import { CldUploadButton } from "next-cloudinary";

export default function UploadImage({ children, user, updateProfilePic }) {
  if (!user) {
    return <div>Error</div>;
  }

  const username = user.userName;

  const onSuccess = async (result) => {
    try {
      const response = await setProfilePic(username, result.info.url);
      updateProfilePic(result.info.url);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <CldUploadButton
      uploadPreset="ml_default"
      onSuccess={onSuccess}
      onError={(error) => console.error("Upload failed: ", error)}
      className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
    >
      {children}
    </CldUploadButton>
  );
}
