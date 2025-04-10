import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function PostCard({
  id,
  user,
  userProfilePic,
  image,
  title,
  description,
  likes,
  comments,
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="border rounded-2xl p-2 shadow-lg bg-white w-full max-w-md mx-auto h-[600px] flex flex-col justify-between">
        <div className="flex items-center gap-2 p-1">
          <img
            src={userProfilePic}
            alt={user}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="text-base font-semibold">{user}</div>
        </div>

        <div className="flex-1 w-full overflow-hidden rounded-xl">
          <Link href={"/photos/" + id}>
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>

        <div className="pt-2">
          <div className="text-base font-bold">{title}</div>
          <div className="flex justify-between items-center mt-2">
            <button>
              <Heart />
            </button>
            <MessageCircle />
          </div>
        </div>
      </div>
    </div>
  );
}
