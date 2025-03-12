"use client";
import { useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export default function LoadingModal({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <ClipLoader size={40} color="#3498db" />
        <p className="mt-4 text-gray-700 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
}
