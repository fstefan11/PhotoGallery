"use client";

import AlbumCard from "@/components/album/albumCard";
import ConfirmDeleteModal from "@/components/confirmDeleteModalComponent";
import LoadingModal from "@/components/loadingModalComponent";
import { getAlbumsByUserId } from "@/lib/actions/albumActions";
import { getPhotosByUsername } from "@/lib/actions/photoActions";
import {
  deleteUserById,
  getCurrentUser,
  getUserByUsername,
} from "@/lib/actions/userActions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function UserPage({ params }) {
  const username = React.use(params).slug;
  const [user, setUser] = useState();
  const [photos, setPhotos] = useState();
  const [albums, setAlbums] = useState();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState();
  const [confirmModal, setConfirmModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getUserByUsername(username);
        if (userRes.success) setUser(userRes.user);
        const photosRes = await getPhotosByUsername(username);
        if (photosRes.success) setPhotos(photosRes.photos);
        const albumsRes = await getAlbumsByUserId(userRes.user._id);
        if (albumsRes.success) setAlbums(albumsRes.albums);
        const sessionRes = await getCurrentUser();
        if (sessionRes.success) setCurrentUser(sessionRes.user);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteUser = async () => {
    setLoading(true);
    try {
      const response = await deleteUserById(user._id);
      if (response.success) router.push("/users");
    } catch (e) {
      setLoading(false);
    }
  };

  if (loading) return <LoadingModal isLoading={loading} />;
  if (!loading && !user) return <div>User not found!</div>;
  if (!loading)
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Account Info */}
        <section className="mb-12 bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
          <h3 className="text-3xl mb-6 text-center">{user.userName}</h3>
          <div className="flex flex-col items-center gap-8">
            <div className="relative w-96 h-96 overflow-hidden rounded-full border-4 border-gray-300 shadow-lg">
              <img
                src={user.profilePic}
                alt="Profile picture"
                crop="fill"
                width={500}
                height={500}
                className="object-cover w-full h-full"
              />
            </div>
            {currentUser?.role == "admin" && (
              <>
                <button
                  type="button"
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  onClick={() => setConfirmModal(true)}
                >
                  Delete User
                </button>
                {confirmModal && (
                  <ConfirmDeleteModal
                    handleDelete={deleteUser}
                    onCancel={() => setConfirmModal(false)}
                  >
                    Are you sure do you want to delete this user?
                  </ConfirmDeleteModal>
                )}
              </>
            )}
          </div>
        </section>

        <hr className="my-12 border-gray-300" />

        {/* My Photos */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Photos</h2>
          </div>
          {photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <Link href={`/photos/${photo.id}`} key={photo.id}>
                  <img
                    src={photo.url}
                    alt=""
                    className="h-[300px] w-full object-cover rounded-xl shadow hover:scale-105 hover:brightness-90 transition"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">There are no photos uploaded yet.</p>
          )}
        </section>

        <hr className="my-12 border-gray-300" />

        {/* My Albums */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Albums</h2>
          </div>

          {albums.length > 0 ? (
            <div className="flex flex-wrap gap-6">
              {albums.map((album) => (
                <AlbumCard
                  key={album._id}
                  album={album}
                  link={"/users/" + user.userName + "/albums/" + album._id}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">There are no albums created yet.</p>
          )}
        </section>
      </div>
    );
}
