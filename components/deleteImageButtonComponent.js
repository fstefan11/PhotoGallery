"use client";

import { deleteImageById } from "@/lib/actions/photoActions";
import RedButton from "./redButtonComponent";
import { useRouter } from "next/navigation";
import LoadingModal from "./loadingModalComponent";
import { useState } from "react";
import ConfirmDeleteModal from "./confirmDeleteModalComponent";

export default function DeleteImageButton({ imageId }) {
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    const response = await deleteImageById(imageId);
    router.push("/dashboard");
  };
  return (
    <div>
      <button onClick={() => setShowConfirmModal(true)}>
        <RedButton>Delete</RedButton>
      </button>
      <LoadingModal isLoading={loading} />
      {showConfirmModal && (
        <ConfirmDeleteModal
          handleDelete={handleDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
}
