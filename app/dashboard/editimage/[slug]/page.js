"use client";

import BlueButton from "@/components/blueButtonComponent";
import DeleteImageButton from "@/components/deleteImageButtonComponent";
import LoadingModal from "@/components/loadingModalComponent";
import {
  deleteImageById,
  editImageById,
  getPhotoById,
} from "@/lib/actions/photoActions";
import { postSchema } from "@/lib/validationSchema";
import React, { useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { z } from "zod";

export default function EditImage({ params }) {
  const slug = React.use(params).slug;

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formPending, setFormPending] = useState(false);
  const [formErrors, setFormErrors] = useState();

  const handleEdit = async (event) => {
    setFormErrors();
    event.preventDefault();
    setFormPending(true);
    const formData = new FormData(event.target);
    const title = formData.get("title");
    const description = formData.get("description");
    if (title === image.title && description === image.description) {
      toast.error("No changes were made");
      setFormPending(false);
      return;
    }
    try {
      postSchema.parse({ title, description });
      const data = {
        title: formData.get("title"),
        description: formData.get("description"),
      };
      const response = await editImageById(slug, data);
      if (response.success) {
        setImage(response.image);
        toast.success("Post edited succesfully");
      } else {
        setError("Image edit failed");
      }
    } catch (e) {
      console.log(e);
      if (e instanceof z.ZodError) {
        const errors = e.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {});
        setFormErrors(errors);

        setFormPending(false);
      }
    } finally {
      setFormPending(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getPhotoById(slug);
        if (response.success === true) {
          setImage(response.image);
        } else {
          setError("Image not found");
        }
      } catch (e) {
        setError("Error fetching image");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  if (loading) {
    return <LoadingModal isLoading={loading} />;
  }
  if (!image) {
    return <div>Image not found</div>;
  }

  return (
    <div>
      <div className="flex justify-center h-[calc(100vh-145px)]">
        <img
          src={image.url}
          alt={image.title}
          className="max-w-full max-h-full object-contain"
        ></img>
      </div>

      <div className="text-center mt-4 text-3xl">{image.title}</div>
      <div className="text-center mt-4">{image.description}</div>
      <br />
      <br />
      <form className="xl:flex-grow" onSubmit={handleEdit}>
        <div>
          <div className="text-red-500">{formErrors?.noChange}</div>
          <div className="w-full mb-6">
            <div className="text-red-500">{formErrors?.title}</div>
            <label className="block mb-2">Title</label>
            <input
              name="title"
              defaultValue={image.title}
              type="text"
              placeholder="Enter Title"
              className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
            />
          </div>
          <div className="w-full mb-6">
            <div className="text-red-500">{formErrors?.description}</div>
            <label className="block mb-2">Description</label>
            <textarea
              defaultValue={image.description}
              name="description"
              type="textarea"
              placeholder="Enter Description"
              className="text-gray-800 h-40 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
            />
          </div>
        </div>
        <button type="submit">
          <BlueButton>Edit</BlueButton>
        </button>
        <LoadingModal isLoading={formPending} />
      </form>
      <br />
      <br />
      <DeleteImageButton imageId={image._id} />
      <br />
      <br />
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
    </div>
  );
}
