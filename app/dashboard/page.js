import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getProfilePic, getUserById } from "@/lib/actions/userActions";
import UploadImage from "@/components/cloudinaryUploadComponent";
import Providers from "@/components/providersComponent";
import ProfilePicture from "@/components/profilePictureComponent";
import { redirect } from "next/navigation";
import BlueButton from "@/components/blueButtonComponent";
import Link from "next/link";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const user = await getUserById(session.user.id);
  const profilePic = user.profilePic;
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
    </div>
  );
}
