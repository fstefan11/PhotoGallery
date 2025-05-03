"use client";

import {
  addComment,
  deleteComment,
  getPhotoById,
  likePhoto,
} from "@/lib/actions/photoActions";
import { Heart, HeartIcon, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import React, {
  startTransition,
  useEffect,
  useOptimistic,
  useState,
} from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";

export default function PostPageComponent({ img }) {
  const [image, setImage] = useState(img);
  const [currentUserId, setCurrentUserId] = useState();
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(image.likes);

  const session = useSession();

  if (session.data) if (!currentUserId) setCurrentUserId(session.data.user.id);

  const handleLike = async () => {
    if (currentUserId) {
      startTransition(() => {
        if (optimisticLikes.includes(currentUserId)) {
          setOptimisticLikes((prev) =>
            prev.filter((item) => item != currentUserId)
          );
        } else {
          setOptimisticLikes((prev) => [...prev, currentUserId]);
        }
      });

      const result = await likePhoto(currentUserId, image._id);
      if (result.success) {
        setImage((prev) => ({
          ...prev,
          likes: result.likes,
        }));
      }
    } else {
      toast.error("You are not signed in!");
    }
  };

  const submitComment = async (event) => {
    event.preventDefault();
    if (currentUserId) {
      const formData = new FormData(event.target);
      const comment = formData.get("comment");
      if (comment != "") {
        try {
          const result = await addComment(currentUserId, comment, image._id);
          if (result.success) {
            setImage((prev) => ({
              ...prev,
              comments: result.comments,
            }));
            event.target.reset();
          }
        } catch (error) {}
      } else {
        toast.error("Please enter a comment.");
      }
    } else {
      toast.error("You are not signed in!");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const result = await deleteComment(commentId, image._id);
      if (result.success) {
        setImage((prev) => ({
          ...prev,
          comments: result.comments,
        }));
      } else {
        console.log("eroare");
      }
    } catch (error) {}
  };

  if (!image) return <div>Image not found</div>;

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
          <motion.button
            onClick={handleLike}
            className="flex items-center text-gray-500 hover:text-red-500"
            whileTap={{ scale: 1.3 }}
          >
            {optimisticLikes.includes(currentUserId) ? (
              <Heart fill="red" className="border-red-500" />
            ) : (
              <Heart />
            )}

            <span className="ml-1">{optimisticLikes.length}</span>
          </motion.button>
          <button className="flex items-center text-gray-500 hover:text-blue-500">
            <MessageCircle />
            <span className="ml-1"></span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="px-4 py-2">
        <div className="mb-2">
          {image.comments.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start space-x-2 mb-2 group"
            >
              <img
                src={comment.user.profilePic}
                alt="User profile"
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="bg-gray-100 px-3 py-2 rounded-lg max-w-xs relative">
                <p className="text-sm font-medium">{comment.user.userName}</p>
                <p className="text-sm text-gray-700">{comment.text}</p>
                {comment.user._id === currentUserId && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="absolute top-0 right-0 mt-1 mr-1 text-red-500 hover:text-white hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center invisible group-hover:visible transition-opacity duration-200"
                  >
                    <span className="text-sm leading-none">&times;</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <form
          onSubmit={submitComment}
          className="flex items-center pt-2 border-t"
        >
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 text-sm outline-none bg-transparent"
            name="comment"
          />
          <button type="submit" className="text-blue-500 font-medium text-sm">
            Postează
          </button>
        </form>
      </div>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        toastClassName="text-lg"
      />
    </div>
  );
}
