import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getProfilePic, getUserById } from "@/lib/actions/userActions";
import ProfilePicture from "@/components/profilePictureComponent";
import { redirect } from "next/navigation";
import BlueButton from "@/components/blueButtonComponent";
import Link from "next/link";
import { getPhotosByUsername } from "@/lib/actions/photoActions";
import { getUserAlbums } from "@/lib/actions/albumActions";
import AlbumCard from "@/components/album/albumCard";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const albums = (await getUserAlbums()).albums;
  const user = await getUserById(session.user.id);
  const profilePic = user.profilePic;
  const result = await getPhotosByUsername(user.userName);
  const photos = result.photos;
  if (!result.success) {
    redirect("/error");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">
        My Account
      </h2>
      {/* Account Info */}
      <section className="mb-12 bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
        <h3 className="text-3xl mb-6 text-center">{user.userName}</h3>

        <div>
          <ProfilePicture user={user} profilePicUrl={profilePic} />
        </div>
      </section>

      <hr className="my-12 border-gray-300" />

      {/* My Photos */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">My Photos</h2>
          <Link href="/dashboard/uploadimage">
            <BlueButton>Upload Image</BlueButton>
          </Link>
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Link href={`/photos/${photo.id}`} key={photo.id}>
                <img
                  src={photo.url}
                  alt=""
                  className="h-[300px] w-full object-cover rounded-xl shadow hover:scale-105 hover:brightness-90 transition"
                />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You haven't uploaded any photos yet.</p>
        )}
      </section>

      <hr className="my-12 border-gray-300" />

      {/* My Albums */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">My Albums</h2>
          <Link href="/dashboard/createalbum">
            <BlueButton>Create Album</BlueButton>
          </Link>
        </div>

        {albums.length > 0 ? (
          <div className="flex flex-wrap gap-6">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You haven't created any albums yet.</p>
        )}
      </section>
    </div>
  );
}
