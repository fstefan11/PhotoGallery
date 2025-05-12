"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa"; // Importăm simbolul "plus" din react-icons
import ImageSelectModal from "./imageSelectModal";

export default function ImageSelectorButton({
  availableImages,
  onAddImages,
  selectedImages,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button
        type="button"
        onClick={openModal}
        className="flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-lg"
      >
        <FaPlus className="text-2xl" />
      </button>

      {isModalOpen && (
        <ImageSelectModal
          availableImages={availableImages}
          onClose={closeModal}
          onAddImages={onAddImages}
          alreadySelectedImages={selectedImages}
        />
      )}
    </div>
  );
}
