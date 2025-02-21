import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  return (
    <div className="mt-20">
      <div className="text-3xl">Dashboard</div>
      <br />
      <br />
      <p>Username: {session.user.userName}</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
    </div>
  );
}
