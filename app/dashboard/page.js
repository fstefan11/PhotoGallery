import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getProfilePic } from "@/lib/actions/userActions";
import UploadImage from "@/components/cloudinaryUploadComponent";
import Providers from "@/components/providersComponent";
import ProfilePicture from "@/components/profilePictureComponent";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const profilePic = await getProfilePic(session.user.userName);
  return (
    <div className="mt-20">
      <div className="text-3xl">My account</div>
      <br />
      <br />
      <ProfilePicture session={session} profilePicUrl={profilePic} />
      <br />
      <br />
      <div className="flex gap-8 justify-center">
        <div>
          <p>Username: </p>
          <p>Email: </p>
          <p>Role: </p>
        </div>
        <div>
          <p>{session.user.userName}</p>
          <p>{session.user.email}</p>
          <p>{session.user.role}</p>
        </div>
      </div>
    </div>
  );
}
