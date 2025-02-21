"use client";

import { setProfilePic } from "@/lib/actions/userActions";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";

export default function UploadImage({ children }) {
  const { data: session, status } = useSession();
  const onSuccess = (result) => {
    console.log(result);
  };
  const onUpload = (result) => {
    console.log(result);
  };
  return (
    <CldUploadButton
      uploadPreset="ml_default"
      onSuccess={onSuccess}
      onError={(error) => console.error("Upload failed: ", error)}
    >
      {children}
    </CldUploadButton>
  );
}
