"use client";

import {
  addComment,
  deleteComment,
  deleteImageById,
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
import ConfirmDeleteModal from "./confirmDeleteModalComponent";
import Link from "next/link";
import LoadingModal from "./loadingModalComponent";
import { useRouter } from "next/navigation";

export default function PostPageComponent({ img }) {
  const [image, setImage] = useState(img);
  const [currentUserId, setCurrentUserId] = useState();
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(image.likes);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [confirmDeletePostModal, setConfirmDeletePostModal] = useState(false);
  const [pendingDeleteCommentId, setPendingDeleteCommentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const router = useRouter();

  const formattedDate = new Date(image.createdAt).toLocaleDateString("ro-RO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

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
      setConfirmDeleteModal(false);
      setPendingDeleteCommentId(null);
      const result = await deleteComment(commentId, image._id);
      if (result.success) {
        setImage((prev) => ({
          ...prev,
          comments: result.comments,
        }));
      }
    } catch (error) {}
  };

  const handleDeletePost = async () => {
    try {
      if (session?.data?.user?.role == "admin") {
        setLoading(true);
        const response = await deleteImageById(image._id);
        if (response.success) {
          router.push("/photos");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (session.data?.user?.id && !currentUserId) {
      setCurrentUserId(session.data.user.id);
    }
    setLoading(false);
  }, [session.data, currentUserId]);

  if (!image) return <div>Image not found</div>;
  if (loading) return <LoadingModal isLoading={loading} />;
  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden mb-12 mx-auto border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div>
          <div className="flex items-center space-x-3">
            <img
              src={image.userId.profilePic}
              alt="User profile"
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
            <div>
              <h3 className="font-semibold text-gray-800">
                {image.userId.userName}
              </h3>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
          </div>
          {image.albumId && (
            <Link
              href={`/users/${image.userId.userName}/albums/${image.albumId._id}`}
              className="text-sm text-blue-600 hover:underline"
            >
              Album: {image.albumId.name}
            </Link>
          )}
        </div>

        {image.userId._id === currentUserId && (
          <Link
            href={`/dashboard/editimage/${image._id}`}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            Edit
          </Link>
        )}
        {session?.data?.user?.role == "admin" && (
          <>
            <button
              type="button"
              href={`/dashboard/editimage/${image._id}`}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
              onClick={() => setConfirmDeletePostModal(true)}
            >
              Delete
            </button>
            {confirmDeletePostModal && (
              <ConfirmDeleteModal
                handleDelete={handleDeletePost}
                onCancel={() => setConfirmDeletePostModal(false)}
              >
                Are you sure do you want to delete this post?
              </ConfirmDeleteModal>
            )}
          </>
        )}
      </div>

      {/* Title & Description */}
      <div className="px-4 pt-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{image.title}</h2>
        <p className="text-gray-700 mb-4">{image.description}</p>
      </div>

      {/* Image */}
      <div className="w-full max-h-[80vh] overflow-hidden">
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Like & Comment */}
      <div className="px-4 py-3 flex justify-between border-t border-gray-100">
        <div className="flex space-x-6">
          <motion.button
            onClick={handleLike}
            className="flex items-center text-gray-500 hover:text-red-500"
            whileTap={{ scale: 1.2 }}
          >
            {optimisticLikes.includes(currentUserId) ? (
              <Heart fill="red" className="w-5 h-5" />
            ) : (
              <Heart className="w-5 h-5" />
            )}
            <span className="ml-1">{optimisticLikes.length}</span>
          </motion.button>
          <button className="flex items-center text-gray-500 hover:text-blue-500">
            <MessageCircle className="w-5 h-5" />
            <span className="ml-1">{image.comments.length}</span>
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="px-4 py-4">
        <h4 className="text-gray-800 font-medium mb-2">Comments</h4>
        {image.comments.map((comment) => (
          <div
            key={comment._id}
            className="flex items-start space-x-3 mb-3 group"
          >
            <img
              src={comment.user.profilePic}
              alt={comment.user.userName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="bg-gray-100 px-3 py-2 rounded-lg max-w-lg relative">
              <p className="text-sm font-semibold text-gray-800">
                {comment.user.userName}
              </p>
              <p className="text-sm text-gray-700">{comment.text}</p>
              {(comment.user._id === currentUserId ||
                session?.data?.user?.role == "admin") && (
                <button
                  onClick={() => {
                    setConfirmDeleteModal(true);
                    setPendingDeleteCommentId(comment._id);
                  }}
                  className="absolute top-1 right-1 text-red-500 hover:text-white hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center invisible group-hover:visible transition duration-200"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        ))}
        {confirmDeleteModal && (
          <ConfirmDeleteModal
            handleDelete={() => handleDeleteComment(pendingDeleteCommentId)}
            onCancel={() => setConfirmDeleteModal(false)}
          >
            Are you sure you want to delete this comment?
          </ConfirmDeleteModal>
        )}

        {/* Add Comment */}
        <form
          onSubmit={submitComment}
          className="flex items-center pt-4 border-t mt-4"
        >
          <input
            type="text"
            placeholder="Add a comment..."
            name="comment"
            className="flex-1 text-sm px-3 py-2 border rounded-md outline-none"
          />
          <button
            type="submit"
            className="ml-2 text-blue-600 font-medium text-sm"
          >
            Post
          </button>
        </form>
      </div>

      {/* Toasts */}
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
        toastClassName="text-sm"
      />
    </div>
  );
}
