"use client";

import { ImageEditor } from "./ImageEditor/ImageEditor";
import { useRef, useState } from "react";
import BlueButton from "./blueButtonComponent";
import { addPhoto } from "@/lib/actions/photoActions";
import { toast, ToastContainer, Bounce } from "react-toastify";
import LoadingModal from "./loadingModalComponent";
import { useRouter } from "next/navigation";

export default function ImageEditorComponent({ img }) {
  const cropperRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (cropperRef.current) {
      const formData = new FormData(event.target);
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        setLoading(true);
        canvas.toBlob(async (blob) => {
          const buffer = Buffer.from(await blob.arrayBuffer());
          formData.append("image", blob);
          try {
            const response = await addPhoto(formData);
            router.push("/dashboard");
          } catch (e) {
            console.error(e);
          } finally {
            setLoading(false);
          }
        });
      } else {
        toast.error("Please make sure you upload an image first.");
      }
    } else {
      toast.error("Error on submitting form");
    }
  };

  return (
    <div>
      <div className="mb-10 flex flex-col xl:flex-row xl:gap-24">
        <div className="w-full xl:w-auto flex justify-center">
          <div className="w-full xl:h-[550px] max-w-[700px] xl:w-[700px]">
            <ImageEditor cropperRef={cropperRef} />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="xl:flex-grow">
          <div>
            <div className="w-full mb-6">
              <label className="block mb-2">Title</label>
              <input
                name="title"
                type="text"
                placeholder="Enter Title"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
              />
            </div>
            <div className="w-full mb-6">
              <label className="block mb-2">Description</label>
              <textarea
                name="description"
                type="textarea"
                placeholder="Enter Description"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
              />
            </div>
          </div>
          <button type="submit">
            <BlueButton>
              <div className="flex gap-6 items-center">Submit</div>
            </BlueButton>
          </button>
        </form>
      </div>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        toastClassName="text-lg"
      />
      <LoadingModal isLoading={loading} />
    </div>
  );
}
