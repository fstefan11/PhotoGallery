"use client";

import AlbumCard from "@/components/album/albumCard";
import ImageSelectorButton from "@/components/album/imageSelectorButton";
import BlueButton from "@/components/blueButtonComponent";
import { createAlbum, getUserAlbums } from "@/lib/actions/albumActions";
import {
  getPhotosWithoutAlbum,
  getUserPhotos,
} from "@/lib/actions/photoActions";
import { albumSchema } from "@/lib/validationSchema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function CreateAlbumPage() {
  const [formErrors, setFormErrors] = useState();
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadImages = async () => {
      const response = await getPhotosWithoutAlbum();
      if (response.success) {
        setImages(response.photos);
      }
    };
    loadImages();
  }, []);

  const handleSubmit = async (event) => {
    try {
      setFormErrors();
      event.preventDefault();
      const formData = new FormData(event.target);
      albumSchema.parse({
        name: formData.get("name"),
        description: formData.get("description"),
      });
      const response = await createAlbum(formData, selectedImages);
      if (response.success) {
        router.push("/dashboard");
      }
      console.log(response);
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errors = e.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {});
        setFormErrors(errors);
      }
    }
  };
  const handleAddImages = (selectedImages) => {
    setSelectedImages(selectedImages);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl mb-4">Create album</h1>
        <div className="mb-6">
          <div className="text-red-500 text-base">{formErrors?.name}</div>
          <label className="block mb-2">Album name</label>
          <input
            name="name"
            type="text"
            className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
          ></input>
        </div>
        <div className="mb-6">
          <div className="text-red-500 text-base">
            {formErrors?.description}
          </div>
          <label className="block mb-2">Album description</label>
          <input
            name="description"
            type="text"
            className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
          ></input>
        </div>
        <div className="mb-6">
          <ImageSelectorButton
            availableImages={images}
            onAddImages={handleAddImages}
            selectedImages={selectedImages}
          />
        </div>
        <div className="mb-6 flex flex-wrap">
          {selectedImages &&
            selectedImages.map((img) => (
              <div key={img.id} className="relative p-2">
                <img src={img.url} alt={img.title} width={150} height={150} />
                <button
                  onClick={() =>
                    setSelectedImages((prev) =>
                      prev.filter((i) => i.id !== img.id)
                    )
                  }
                  className="absolute top-1 right-1 bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-100"
                >
                  ×
                </button>
              </div>
            ))}
        </div>
        <button type="submit" className="mb-6">
          <BlueButton>Create album</BlueButton>
        </button>
      </form>
    </div>
  );
}
