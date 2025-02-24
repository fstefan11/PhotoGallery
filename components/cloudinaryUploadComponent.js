"use client";

import { setProfilePic } from "@/lib/actions/userActions";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";

export default function UploadImage({ children }) {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading</p>;
  if (!session?.user?.userName) return <p>Nu esti autentificat</p>;

  const user = session?.user?.userName;

  const onSuccess = async (result) => {
    try {
      const response = await setProfilePic(user, result.info.url);
      console.log(response);
      console.log(result);
    } catch (e) {
      console.error(e);
    }
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
