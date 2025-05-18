"use client";

import Link from "next/link";

export default function AlbumCard({ album, link }) {
  return (
    <Link
      href={link || `/dashboard/editalbum/${album.id}`}
      className="relative block w-[300px] h-[300px] rounded-3xl overflow-hidden group transform transition-transform duration-300 hover:scale-[1.02] shadow-xl border border-gray-200 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg"
    >
      <div className="relative w-full aspect-square overflow-hidden">
        <img
          src={album.coverImageUrl || "/noimage.png"}
          alt={album.title}
          className="object-cover object-center w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
        <div className="absolute bottom-0 z-20 p-5 w-full backdrop-blur-md bg-white/10 text-white">
          <h3 className="text-2xl font-bold">{album.title}</h3>
          {album.description && (
            <p className="text-sm opacity-80 mt-1 line-clamp-2">
              {album.description}
            </p>
          )}
          <p className="text-xs mt-2 text-gray-300">
            {album.photoCount} photos
          </p>
        </div>
      </div>
    </Link>
  );
}
