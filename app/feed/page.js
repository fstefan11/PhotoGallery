import PostCard from "@/components/postCardComponent";
import { getPhotos } from "@/lib/actions/photoActions";

export default async function Feed() {
  const result = await getPhotos();
  const images = result.images;
  const image = images[0];
  return (
    <div className="text-3xl">
      Feed
      <PostCard
        user={image.userId.userName}
        userProfilePic={image.userId.profilePic}
        image={image.url}
        title={image.title}
        description={image.description}
        likes={120}
        comments={15}
      />
    </div>
  );
}
