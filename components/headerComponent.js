"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session, status } = useSession();
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav>
      <div className="border-b">
        <div className="container flex mx-auto py-5 justify-between">
          <div>
            <Link href={"/"}>PhotoGallery</Link>
          </div>
          <ul className="flex flex-col md:flex-row gap-4">
            {status === "authenticated" && session.user.role === "user" && (
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
