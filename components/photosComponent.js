"use client";

import PostCard from "@/components/postCardComponent";
import { getPhotos, searchPhoto } from "@/lib/actions/photoActions";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function PhotosComponent() {
  const [images, setImages] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentUserId, setCurrentUserId] = useState();
  const [search, setSearch] = useState();
  const loader = useRef(null);
  const isFetching = useRef(false);

  const session = useSession();

  const fetchImages = useCallback(async () => {
    if (isFetching.current || !hasMore) return;
    isFetching.current = true;

    try {
      const result = await getPhotos(skip, 20);
      if (result.images.length === 0) {
        setHasMore(false);
      } else {
        setImages((prev) => [...prev, ...result.images]);

        setSkip((prev) => prev + 20);
        if (result.images.length < 20) setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to fetch images", err);
    } finally {
      isFetching.current = false;
    }
  }, [skip, hasMore]);

  useEffect(() => {
    fetchImages();

    if (session.data?.user?.id && !currentUserId) {
      setCurrentUserId(session.data.user.id);
    }
  }, [session.data, currentUserId]);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore) {
        fetchImages();
      }
    },
    [hasMore]
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchString = formData.get("search");
    if (searchString != null && searchString != "") {
      const response = await searchPhoto(searchString);
      if (response.success) {
        setImages(response.photos);
        setHasMore(false);
        setSearch(searchString);
      }
    } else {
      window.location.reload();
    }
  };

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshhold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Photo Gallery
        </h1>
        <p className="text-lg text-gray-500 mb-6">
          Explore the latest photos shared by the community.
        </p>

        <form onSubmit={handleSearch}>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search photos..."
                className="w-full rounded-full border border-gray-300 pl-5 pr-12 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
              <button type="submit">
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <PostCard key={image._id} img={image} currentUserId={currentUserId} />
        ))}
      </div>

      {/* Infinite Scroll Loader */}
      {hasMore && (
        <div
          ref={loader}
          className="py-16 text-center text-gray-500 text-sm animate-pulse"
        >
          Loading more photos...
        </div>
      )}
    </div>
  );
}
