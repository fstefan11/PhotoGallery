"use client";

import LoadingModal from "@/components/loadingModalComponent";
import { getAlbumById } from "@/lib/actions/albumActions";
import { getPhotosByAlbumId } from "@/lib/actions/photoActions";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function AlbumPage({ params }) {
  const id = React.use(params).id;
  const [images, setImages] = useState();
  const [album, setAlbum] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const photosRes = await getPhotosByAlbumId(id);
      const albumRes = await getAlbumById(id);
      if (photosRes.success) setImages(photosRes.photos);
      if (albumRes.success) setAlbum(albumRes.album);
      setLoading(false);
    }
    fetchData();
  }, [params]);

  if (loading) {
    return <LoadingModal isLoading={loading} />;
  }

  if (!album) {
    return <div className="p-4 text-red-500">Not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center mt-4 space-x-3">
          <img
            src={album.userId.profilePic}
            alt={album.userId.userName}
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
          <span className="text-gray-700 font-semibold">
            {album.userId.userName}
          </span>
        </div>
        <h2 className="text-4xl font-extrabold text-gray-800">{album.name}</h2>

        {album.description && (
          <p className="text-gray-500 mt-2 text-lg max-w-2xl mx-auto">
            {album.description}
          </p>
        )}
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
          </div>
        ))}
      </div>
    </div>
  );
}
