import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { startTransition, useOptimistic, useState } from "react";
import { motion } from "framer-motion";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { likePhoto } from "@/lib/actions/photoActions";
import PostPageComponent from "./postPageComponent";

export default function PostCard({ img, currentUserId }) {
  const [image, setImage] = useState(img);
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(image.likes);
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

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={image.userId.profilePic}
              alt={image.userId.userName}
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-gray-800">
                {image.userId.userName}
              </span>
              <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="w-full aspect-square bg-white overflow-hidden border border-gray-200">
          <Link href={`/photos/${image._id}`}>
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>

        <div className="px-4 pt-3">
          <h3 className="text-base font-bold text-gray-900 line-clamp-2">
            {image.title}
          </h3>
        </div>

        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
          <motion.button
            onClick={handleLike}
            whileTap={{ scale: 1.2 }}
            className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
          >
            {optimisticLikes.includes(currentUserId) ? (
              <Heart fill="red" className="w-5 h-5" />
            ) : (
              <Heart className="w-5 h-5" />
            )}
            <span className="text-sm">{optimisticLikes.length}</span>
          </motion.button>

          <div className="flex items-center gap-1 text-gray-600">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{image.comments.length}</span>
          </div>
        </div>
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
        toastClassName="text-sm"
      />
    </div>
  );
}
