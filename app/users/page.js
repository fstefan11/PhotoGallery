"use client";

import { useState } from "react";
import { getUsers } from "@/lib/actions/userActions";
import { useEffect } from "react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;

  useEffect(() => {
    async function fetchUsers() {
      const res = await getUsers();
      if (res.success) {
        setUsers(res.users);
      }
    }
    fetchUsers();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  function handlePageChange(page) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  if (users.length === 0) return <div>Loading users...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8">Users</h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {currentUsers.map((user) => (
          <Link
            key={user._id}
            href={"/users/" + user.userName}
            className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow"
          >
            <img
              src={user.profilePic || "/default-profile.png"}
              alt={user.userName}
              className="w-12 h-12 rounded-full object-cover border border-gray-300"
            />
            <span className="text-lg font-medium text-gray-800">
              {user.userName}
            </span>
          </Link>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => handlePageChange(idx + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === idx + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
