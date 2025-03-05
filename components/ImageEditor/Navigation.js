import React, { useRef } from "react";
import cn from "classnames";
import { CropIcon } from "./icons/CropIcon";
import { HueIcon } from "./icons/HueIcon";
import { SaturationIcon } from "./icons/SaturationIcon";
import { ContrastIcon } from "./icons/ContrastIcon";
import { BrightnessIcon } from "./icons/BrightnessIcon";
import { UploadIcon } from "./icons/UploadIcon";
import { DownloadIcon } from "./icons/DownloadIcon";
import { Button } from "./Button";
import "./Navigation.scss";

export const Navigation = ({
  className,
  onChange,
  onUpload,
  onDownload,
  mode,
}) => {
  const setMode = (mode) => () => {
    onChange?.(mode);
  };

  const inputRef = useRef(null);

  const onUploadButtonClick = () => {
    inputRef.current?.click();
  };

  const onLoadImage = (event) => {
    // Reference to the DOM input element
    const { files } = event.target;

    // Ensure that you have a file before attempting to read it
    if (files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);

      resizeImage(file)
        .then((resizedUrl) => {
          if (onUpload) {
            onUpload(resizedUrl);
          }
        })
        .catch((err) => {
          console.error("Error on image resize:", err);
        });
    }
    // Clear the event target value to give the possibility to upload the same image:
    event.target.value = "";
  };

  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onloadend = () => {
        img.src = reader.result;
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 2048;
        const maxHeight = 2048;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((resizedBlob) => {
          const resizedUrl = URL.createObjectURL(resizedBlob);
          resolve(resizedUrl);
        }, "image/jpeg");
      };
    });
  };

  return (
    <div className={cn("image-editor-navigation", className)}>
      <Button
        className={"image-editor-navigation__button"}
        onClick={onUploadButtonClick}
      >
        <UploadIcon />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onLoadImage}
          className="image-editor-navigation__upload-input"
        />
      </Button>
      <div className="image-editor-navigation__buttons">
        <Button
          className={"image-editor-navigation__button"}
          active={mode === "crop"}
          onClick={setMode("crop")}
        >
          <CropIcon />
        </Button>
        <Button
          className={"image-editor-navigation__button"}
          active={mode === "saturation"}
          onClick={setMode("saturation")}
        >
          <SaturationIcon />
        </Button>
        <Button
          className={"image-editor-navigation__button"}
          active={mode === "brightness"}
          onClick={setMode("brightness")}
        >
          <BrightnessIcon />
        </Button>
        <Button
          className={"image-editor-navigation__button"}
          active={mode === "contrast"}
          onClick={setMode("contrast")}
        >
          <ContrastIcon />
        </Button>
        <Button
          className={"image-editor-navigation__button"}
          active={mode === "hue"}
          onClick={setMode("hue")}
        >
          <HueIcon />
        </Button>
      </div>
      <Button
        className={"image-editor-navigation__button"}
        onClick={onDownload}
      >
        <DownloadIcon />
      </Button>
    </div>
  );
};
