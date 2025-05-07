import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getProfilePic, getUserById } from "@/lib/actions/userActions";
import ProfilePicture from "@/components/profilePictureComponent";
import { redirect } from "next/navigation";
import BlueButton from "@/components/blueButtonComponent";
import Link from "next/link";
import { getPhotosByUsername } from "@/lib/actions/photoActions";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const user = await getUserById(session.user.id);
  const profilePic = user.profilePic;
  const result = await getPhotosByUsername(user.userName);
  const photos = result.photos;
  if (!result.success) {
    redirect("/error");
  }

  return (
    <div>
      <div className="text-3xl">My account</div>
      <br />
      <br />
      <ProfilePicture user={user} profilePicUrl={profilePic} />
      <br />
      <br />
      <div className="flex gap-8 justify-center">
        <div>
          <p>Username: </p>
          <p>Email: </p>
          <p>Role: </p>
        </div>
        <div>
          <p>{user.userName}</p>
          <p>{user.email}</p>
          <p>{user.role}</p>
        </div>
      </div>
      <br />
      <br />
      <hr />
      <br />
      <br />
      <div className="text-3xl">My photos</div>
      <br />
      <br />
      <Link href={"/dashboard/uploadimage"}>
        <BlueButton>Upload image</BlueButton>
      </Link>
      <br />
      <br />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <Link href={"/dashboard/editimage/" + photo.id} key={photo.id}>
            <img
              className="h-[500px] w-full object-cover rounded-lg transition-transform duration-300 ease-in-out lg:hover:scale-105 lg:hover:brightness-75"
              src={photo.url}
              alt=""
            />
          </Link>
        ))}
      </div>
      <br />
      <br />
      <div className="text-3xl">My albums</div>
      <br />
      <br />
      <BlueButton>Create album</BlueButton>
    </div>
  );
}
