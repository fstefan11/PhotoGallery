"use client";

import { getPhotoById, likePhoto } from "@/lib/actions/photoActions";
import { Heart, HeartIcon, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function PostPageComponent({ imageId }) {
  const [image, setImage] = useState();
  const [currentUserId, setCurrentUserId] = useState();

  const session = useSession();

  const fetchPost = async () => {
    const result = await getPhotoById(imageId);
    if (!result.success) return <div>Image not found</div>;
    else {
      setImage(result.image);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  console.log(session);

  if (session.data) if (!currentUserId) setCurrentUserId(session.data.user.id);

  const handleLike = async () => {
    if (currentUserId) {
      const result = await likePhoto(currentUserId, image._id);
      if (result.success) fetchPost();
    }
  };

  if (!image) return <div>Image not found</div>;

  console.log(image);

  return (
    <div className="w-full max-w-full bg-white rounded-lg shadow-md overflow-hidden mb-8">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img
            src={image.userId.profilePic}
            alt="User profile"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div>
            <h3 className="font-semibold text-gray-800">
              {image.userId.userName}
            </h3>
          </div>
        </div>
      </div>

      {/* Post Title */}
      <h2 className="px-4 pb-2 text-xl font-bold text-gray-900">
        {image.title}
      </h2>

      {/* Post Description */}
      <p className="px-4 pb-3 text-gray-700">{image.description}</p>

      {/* Post Image - Full screen height and width */}
      <div className="w-full h-screen max-h-screen">
        <img
          src={image.url}
          alt="Mountain landscape"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 flex justify-between border-b">
        <div className="flex space-x-4">
          <button
            onClick={handleLike}
            className="flex items-center text-gray-500 hover:text-red-500"
          >
            {image.likes.includes(currentUserId) ? (
              <Heart fill="red" className="border-red-500" />
            ) : (
              <Heart />
            )}

            <span className="ml-1">{image.likes.length}</span>
          </button>
          <button className="flex items-center text-gray-500 hover:text-blue-500">
            <MessageCircle />
            <span className="ml-1"></span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="px-4 py-2">
        <div className="mb-2">
          <div className="flex items-start space-x-2 mb-2">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User profile"
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="bg-gray-100 px-3 py-2 rounded-lg max-w-xs">
              <p className="text-sm font-medium">Ion Ionescu</p>
              <p className="text-sm text-gray-700">
                Arătați minunat! Unde exact ați fost?
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="User profile"
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="bg-gray-100 px-3 py-2 rounded-lg max-w-xs">
              <p className="text-sm font-medium">Maria Popescu</p>
              <p className="text-sm text-gray-700">
                La cabana Babele. Recomand cu căldură!
              </p>
            </div>
          </div>
        </div>
        <button className="text-xs text-gray-500 hover:text-gray-700 mb-2">
          Vezi toate cele 84 de comentarii
        </button>

        {/* Add Comment */}
        <form className="flex items-center pt-2 border-t">
          <input
            type="text"
            placeholder="Adaugă un comentariu..."
            className="flex-1 text-sm outline-none bg-transparent"
          />
          <button type="submit" className="text-blue-500 font-medium text-sm">
            Postează
          </button>
        </form>
      </div>
    </div>
  );
}
