"use client";

import { useState } from "react";

export default function ImageSelectModal({
  availableImages,
  onClose,
  onAddImages,
  alreadySelectedImages,
}) {
  const [selectedImages, setSelectedImages] = useState(alreadySelectedImages);

  const handleImageSelect = (image) => {
    setSelectedImages((prev) => {
      if (prev.includes(image)) {
        return prev.filter((img) => img.id != image.id);
      } else {
        return [...prev, image];
      }
    });
  };

  const handleAddImages = () => {
    onAddImages(selectedImages);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 mx-6 w-full max-w-6xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Select photos for album</h3>
          <button onClick={onClose} className="text-red-500">
            Close
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {availableImages.map((image) => (
              <div
                key={image.id}
                className={`relative group cursor-pointer rounded-lg overflow-hidden ${
                  selectedImages.includes(image.id)
                    ? "border-4 border-blue-500"
                    : ""
                }`}
                onClick={() => handleImageSelect(image)}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  width={150}
                  height={150}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                {selectedImages.includes(image) && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <span className="text-white text-lg">Selected</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddImages}
          className="mt-4 w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Add to album
        </button>
      </div>
    </div>
  );
}
