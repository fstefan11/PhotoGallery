import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { startTransition, useOptimistic, useState } from "react";
import { motion } from "framer-motion";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { likePhoto } from "@/lib/actions/photoActions";

export default function PostCard({ img, currentUserId }) {
  const [image, setImage] = useState({
    ...img,
    likes: img.likes.map((like) => like.userId),
  });
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(image.likes);

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
      <div className="border rounded-2xl p-2 shadow-lg bg-white w-full max-w-md mx-auto h-[600px] flex flex-col justify-between">
        <div className="flex items-center gap-2 p-1">
          <img
            src={image.userId.profilePic}
            alt={image.userId.userName}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="text-base font-semibold">{image.userId.userName}</div>
        </div>

        <div className="flex-1 w-full overflow-hidden rounded-xl">
          <Link href={"/photos/" + img._id}>
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>

        <div className="pt-2">
          <div className="text-base font-bold">{image.title}</div>
          <div className="flex justify-between items-center mt-2">
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
            <div className="flex items-center gap-1">
              <div className="font-semibold">{image.comments.length}</div>
              <MessageCircle />
            </div>
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
        toastClassName="text-lg"
      />
    </div>
  );
}
