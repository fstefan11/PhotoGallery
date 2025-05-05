"use client";

import PhotosComponent from "@/components/photosComponent";
import PostCard from "@/components/postCardComponent";
import { getPhotos } from "@/lib/actions/photoActions";
import { SessionProvider } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Photos() {
  return (
    <SessionProvider>
      <PhotosComponent />
    </SessionProvider>
  );
}
