import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getProfilePic } from "@/lib/actions/userActions";
import { CldUploadButton } from "next-cloudinary";
import UploadImage from "@/components/cloudinaryUploadComponent";
import Providers from "@/components/providersComponent";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const profilePic = await getProfilePic(session.user.username);
  return (
    <div className="mt-20">
      <div className="text-3xl">Dashboard</div>
      <br />
      <br />
      <img src={profilePic} alt="Profile picture" width={300} height={300} />
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
