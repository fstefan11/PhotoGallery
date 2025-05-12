"use client";

import { getAlbumById } from "@/lib/actions/albumActions";
import { getPhotosByAlbumId } from "@/lib/actions/photoActions";
import React, { useEffect, useState } from "react";

export default function EditAlbum({ params }) {
  const slug = React.use(params).slug;
  const [images, setImages] = useState();
  const [album, setAlbum] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [albumRes, photosRes] = await Promise.all([
        getAlbumById(slug),
        getPhotosByAlbumId(slug),
      ]);
      if (albumRes.success) setAlbum(albumRes.album);
      if (photosRes.success) setImages(photosRes.photos);
      setLoading(false);
    };
    loadData();
  }, [slug]);

  if (loading) {
    return <div className="p-4 text-gray-500">Se încarcă albumul...</div>;
  }

  if (!album) {
    return <div className="p-4 text-red-500">Albumul nu a fost găsit.</div>;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-gray-800">{album.name}</h2>
        {album.description && (
          <p className="text-gray-500 mt-2 text-lg max-w-2xl mx-auto">
            {album.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image._id}
            className="relative group overflow-hidden rounded-2xl shadow-lg"
          >
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
          </div>
        ))}
      </div>
    </section>
  );
}
