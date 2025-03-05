"use client";

import { ImageEditor } from "./ImageEditor/ImageEditor";

export default function ImageEditorComponent({ img }) {
  return (
    <div className="max-w-[700px]">
      <ImageEditor />
    </div>
  );
}
