"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header({ session }) {
  // const { data: session, status } = useSession();
  // console.log(session);
  // console.log(status);
  // console.log(session);

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };
  // if (!session)
  //   return (
  //     <nav className="sticky top-0 bg-white border-b z-50 shadow-sm">
  //       <div className="container mx-auto px-4 py-4 flex items-center justify-between">
  //         {/* Logo */}
  //         <Link href="/" className="text-xl font-bold text-gray-800">
  //           PhotoGallery
  //         </Link>
  //       </div>
  //     </nav>
  //   );

  return (
    <nav className="sticky top-0 bg-white border-b z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          PhotoGallery
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Nav items */}
        <ul
          className={`${
            isOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full bg-white shadow-md md:shadow-none md:static md:flex md:items-center md:gap-6 md:w-auto`}
        >
          <>
            {session?.user?.role === "user" && (
              <li className="px-4 py-2 md:p-0">
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  My Account
                </Link>
              </li>
            )}
            <li className="px-4 py-2 md:p-0">
              <Link
                href="/photos"
                className="text-gray-700 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Photos
              </Link>
            </li>
            <li className="px-4 py-2 md:p-0">
              <Link
                href="/users"
                className="text-gray-700 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Users
              </Link>
            </li>
            <li className="px-4 py-2 md:p-0">
              {!session ? (
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Log In
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="text-red-600 hover:underline"
                >
                  Logout
                </button>
              )}
            </li>
            {!session && (
              <li className="px-4 py-2 md:p-0">
                <Link
                  href="/register"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </li>
            )}
          </>
        </ul>
      </div>
    </nav>
  );
}
