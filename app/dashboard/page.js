import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getProfilePic } from "@/lib/actions/userActions";
import UploadImage from "@/components/cloudinaryUploadComponent";
import Providers from "@/components/providersComponent";
import ProfilePicture from "@/components/profilePictureComponent";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const profilePic = await getProfilePic(session.user.userName);
  return (
    <div className="mt-20">
      <div className="text-3xl">Dashboard</div>
      <br />
      <br />
      {profilePic && <ProfilePicture publicId={profilePic} />}
      <Providers>
        <UploadImage>Change profile picture</UploadImage>
      </Providers>
      <br />
      <br />
      <p>Username: {session.user.userName}</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
    </div>
  );
}
