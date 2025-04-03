import { Heart, MessageCircle } from "lucide-react";

export default function PostCard({
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
      <div className="border rounded-2xl p-2 shadow-lg bg-white max-w-md mx-auto">
        <div className="flex items-center gap-2 p-1">
          <div>
            <img
              src={userProfilePic}
              alt={user}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div className="text-base">{user}</div>
        </div>
        <div className="h-[500px]">
          <img
            src={image}
            alt={title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <div className="p-1 text-base font-bold">{title}</div>
        <div className="flex justify-between">
          <button>
            <Heart />
          </button>
          <div>
            <MessageCircle />
          </div>
        </div>
      </div>
    </div>
  );
}
