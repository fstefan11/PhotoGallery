import React, { useState, useRef } from "react";
import cn from "classnames";
import { Cropper, CropperPreview } from "react-advanced-cropper";
import { AdjustablePreviewBackground } from "./AdjustablePreviewBackground";
import { Navigation } from "./Navigation";
import { Slider } from "./Slider";
import { AdjustableCropperBackground } from "./AdjustableCropperBackground";
import { Button } from "./Button";
import { ResetIcon } from "./icons/ResetIcon";
import "react-advanced-cropper/dist/style.css";
import "./styles.scss";
import { uploadToCloudinary } from "@/lib/actions/cloudinaryActions";

if (typeof window !== "undefined") {
  require("context-filter-polyfill");
}

export const ImageEditor = ({ cropperRef }) => {
  // const cropperRef = useRef(null);
  const previewRef = useRef(null);

  const [src, setSrc] = useState();

  const [mode, setMode] = useState("crop");

  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    hue: 0,
    saturation: 0,
    contrast: 0,
  });

  const onChangeValue = (value) => {
    if (mode in adjustments) {
      setAdjustments((previousValue) => ({
        ...previousValue,
        [mode]: value,
      }));
    }
  };

  const onReset = () => {
    setMode("crop");
    setAdjustments({
      brightness: 0,
      hue: 0,
      saturation: 0,
      contrast: 0,
    });
  };

  const onUpload = (blob) => {
    onReset();
    setMode("crop");
    setSrc(blob);
  };

  const onDownload = () => {
    if (cropperRef.current) {
      const newTab = window.open();
      if (newTab) {
        newTab.document.body.innerHTML = `<img src="${cropperRef.current
          .getCanvas()
          ?.toDataURL()}"/>`;
      }
    }
  };

  const onUpdate = () => {
    previewRef.current?.refresh();
  };

  const changed = Object.values(adjustments).some((el) => Math.floor(el * 100));

  const cropperEnabled = mode === "crop";

  return (
    <div className="h-full">
      <div className={"image-editor flex flex-col h-full"}>
        <div className="image-editor__cropper flex-grow">
          <Cropper
            src={src}
            ref={cropperRef}
            stencilProps={{
              movable: cropperEnabled,
              resizable: cropperEnabled,
              lines: cropperEnabled,
              handlers: cropperEnabled,
              overlayClassName: cn(
                "image-editor__cropper-overlay",
                !cropperEnabled && "image-editor__cropper-overlay--faded"
              ),
            }}
            backgroundWrapperProps={{
              scaleImage: cropperEnabled,
              moveImage: cropperEnabled,
            }}
            backgroundComponent={AdjustableCropperBackground}
            backgroundProps={adjustments}
            onUpdate={onUpdate}
          />
          {mode !== "crop" && (
            <Slider
              className="image-editor__slider"
              value={adjustments[mode]}
              onChange={onChangeValue}
            />
          )}
          <CropperPreview
            className={"image-editor__preview"}
            ref={previewRef}
            cropper={cropperRef}
            backgroundComponent={AdjustablePreviewBackground}
            backgroundProps={adjustments}
          />
          <Button
            className={cn(
              "image-editor__reset-button",
              !changed && "image-editor__reset-button--hidden"
            )}
            onClick={onReset}
          >
            <ResetIcon />
          </Button>
        </div>
        <Navigation
          mode={mode}
          onChange={setMode}
          onUpload={onUpload}
          onDownload={onDownload}
          className={"mb-0"}
        />
      </div>
    </div>
  );
};
