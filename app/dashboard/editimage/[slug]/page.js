"use client";

import DeleteImageButton from "@/components/deleteImageButtonComponent";
import LoadingModal from "@/components/loadingModalComponent";
import { getUserAlbums } from "@/lib/actions/albumActions";
import { editImageById, getPhotoById } from "@/lib/actions/photoActions";
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
  const [albums, setAlbums] = useState();

  useEffect(() => {
    const loadData = async () => {
      const response = await getUserAlbums();
      if (response.success) {
        setAlbums(response.albums);
      }
    };
    loadData();
  }, []);

  const handleEdit = async (event) => {
    setFormErrors();
    event.preventDefault();
    setFormPending(true);
    const formData = new FormData(event.target);
    const title = formData.get("title");
    const description = formData.get("description");
    const albumId = formData.get("album");
    if (
      title === image.title &&
      description === image.description &&
      albumId == image.albumId
    ) {
      toast.error("No changes were made");
      setFormPending(false);
      return;
    }
    try {
      postSchema.parse({ title, description });
      const data = {
        title: title,
        description: description,
        albumId: albumId,
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-center bg-gray-100 rounded-lg overflow-hidden border mb-8 h-[calc(100vh-300px)]">
        <img
          src={image.url}
          alt={image.title}
          className="object-contain max-h-full max-w-full"
        />
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-gray-800">{image.title}</h2>
        {image.description && (
          <p className="mt-2 text-gray-600 text-lg">{image.description}</p>
        )}
      </div>

      <form
        onSubmit={handleEdit}
        className="bg-white shadow-lg rounded-xl p-8 border border-gray-100"
      >
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Edit Image Info
        </h3>

        {formErrors?.noChange && (
          <div className="text-red-500 mb-4">{formErrors.noChange}</div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            name="title"
            defaultValue={image.title}
            type="text"
            placeholder="Enter Title"
            className="w-full border border-gray-300 px-4 py-3 rounded-md text-gray-800 focus:outline-blue-500"
          />
          {formErrors?.title && (
            <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={image.description}
            placeholder="Enter Description"
            className="w-full border border-gray-300 px-4 py-3 rounded-md text-gray-800 h-32 resize-none focus:outline-blue-500"
          />
          {formErrors?.description && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.description}
            </p>
          )}
        </div>

        <div className="mb-6">
          <select
            id="album"
            name="album"
            defaultValue={image.albumId?._id || ""}
            className="w-full border border-gray-300 px-4 py-3 rounded-md text-gray-800 bg-white focus:outline-blue-500"
          >
            <option value="">No Album</option>
            {albums &&
              albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
          </select>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
          <LoadingModal isLoading={formPending} />
        </div>
      </form>

      <div className="mt-8 flex justify-end">
        <DeleteImageButton imageId={image._id} />
      </div>

      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
        transition={Bounce}
        toastClassName="text-sm"
      />
    </div>
  );
}
