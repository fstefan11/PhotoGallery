"use client";

import { getUserById } from "@/lib/actions/userActions";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const [user, setUser] = useState(null); // Stocăm utilizatorul în state

  useEffect(() => {
    if (session?.user?.id) {
      getUserById(session.user.id).then(setUser).catch(console.error);
    }
  }, [session]);

  return (
    <nav className="sticky top-0 bg-white z-50">
      <div className="border-b">
        <div className="container flex mx-auto py-5 justify-between">
          <div>
            <Link href={"/"}>PhotoGallery</Link>
          </div>
          <ul className="flex flex-col md:flex-row gap-4">
            {status === "authenticated" && user?.role === "user" && (
              <Link href={"/dashboard"}>My Account</Link>
            )}
            <li>Photos</li>
            <li>Categories</li>
            <li>Users</li>
            <li>
              {status != "authenticated" ? (
                <Link href={"/login"}>Log In</Link>
              ) : (
                <button onClick={handleLogout}>Logout</button>
              )}
            </li>
            {status != "authenticated" && (
              <li>
                <Link href={"/register"}>Register</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
