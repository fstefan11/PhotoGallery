"use client";

import ImageSelectorButton from "@/components/album/imageSelectorButton";
import ConfirmDeleteModal from "@/components/confirmDeleteModalComponent";
import LoadingModal from "@/components/loadingModalComponent";
import RedButton from "@/components/redButtonComponent";
import {
  addPhotosToAlbum,
  deleteAlbum,
  getAlbumById,
  removePhotoFromAlbum,
} from "@/lib/actions/albumActions";
import {
  getPhotos,
  getPhotosByAlbumId,
  getPhotosWithoutAlbum,
} from "@/lib/actions/photoActions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function EditAlbum({ params }) {
  const slug = React.use(params).slug;
  const [images, setImages] = useState();
  const [availableImages, setAvailableImages] = useState();
  const [album, setAlbum] = useState();
  const [loading, setLoading] = useState(true);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [confirmDeleteAlbumModal, setConfirmDeleteAlbumModal] = useState(false);
  const [pendingDeletePhotoId, setPendingDeletePhotoId] = useState();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const [albumRes, photosRes, availablePhotosRes] = await Promise.all([
        getAlbumById(slug),
        getPhotosByAlbumId(slug),
        getPhotosWithoutAlbum(),
      ]);
      if (albumRes.success) setAlbum(albumRes.album);
      if (photosRes.success) setImages(photosRes.photos);
      if (availablePhotosRes.success)
        setAvailableImages(availablePhotosRes.photos);
      setLoading(false);
    };
    loadData();
  }, [slug]);

  const handleAddImages = async (selectedImages) => {
    const response = await addPhotosToAlbum(selectedImages, album._id);
    console.log(response);
    if (response.success) {
      setImages(response.photos);
      const availableImagesRes = await getPhotosWithoutAlbum();
      if (availableImagesRes.success) {
        setAvailableImages(availableImagesRes.photos);
      }
    }
  };

  const handleRemoveImage = async (id) => {
    setConfirmDeleteModal(false);
    const response = await removePhotoFromAlbum(id);
    if (response.success) {
      setImages((prev) => prev.filter((image) => image._id !== id));
      const availableImagesRes = await getPhotosWithoutAlbum();
      if (availableImagesRes.success) {
        setAvailableImages(availableImagesRes.photos);
      }
    }
  };

  const handleRemoveAlbum = async () => {
    setLoading(true);
    const response = await deleteAlbum(album._id);
    if (response.success) {
      router.push("/dashboard");
    }
  };

  if (loading) {
    return <LoadingModal isLoading={loading} />;
  }

  if (!album) {
    return <div className="p-4 text-red-500">Not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-gray-800">{album.name}</h2>
        {album.description && (
          <p className="text-gray-500 mt-2 text-lg max-w-2xl mx-auto">
            {album.description}
          </p>
        )}
      </div>
      <div className="mb-6">
        <ImageSelectorButton
          availableImages={availableImages}
          onAddImages={handleAddImages}
          selectedImages={[]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {images.map((image) => (
          <div
            key={image._id}
            className="relative group overflow-hidden rounded-2xl shadow-lg"
            href={"/photos/" + image._id}
          >
            <Link href={"/photos/" + image._id}>
              <img
                src={image.url}
                alt={image.title}
                width={600}
                height={400}
                className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-medium px-4 text-center">
                  {image.description || image.title}
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => {
                setConfirmDeleteModal(true);
                setPendingDeletePhotoId(image._id);
              }}
              className="absolute top-2 right-2 z-50 bg-white text-gray-700 hover:bg-red-500 hover:text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
            >
              <span className="text-lg leading-none">&times;</span>
            </button>
          </div>
        ))}
        {confirmDeleteModal && (
          <ConfirmDeleteModal
            handleDelete={() => handleRemoveImage(pendingDeletePhotoId)}
            onCancel={() => setConfirmDeleteModal(false)}
          >
            Are you sure you want to remove this photo from album {album.name}
          </ConfirmDeleteModal>
        )}
      </div>
      <button type="button" onClick={() => setConfirmDeleteAlbumModal(true)}>
        <RedButton>Delete</RedButton>
      </button>
      {confirmDeleteAlbumModal && (
        <ConfirmDeleteModal
          handleDelete={() => handleRemoveAlbum()}
          onCancel={() => setConfirmDeleteAlbumModal(false)}
        >
          Are you sure you want to delete this album?
        </ConfirmDeleteModal>
      )}
      <LoadingModal isLoading={loading} />
    </div>
  );
}
