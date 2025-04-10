"use client";

import PostCard from "@/components/postCardComponent";
import { getPhotos } from "@/lib/actions/photoActions";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Photos() {
  const [images, setImages] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const isFetching = useRef(false);

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
  }, []);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore) {
        fetchImages();
      }
    },
    [hasMore]
  );

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
    <div>
      <h1 className="text-3xl font-extrabold">Photos</h1>
      <br />
      <br />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <PostCard
            key={image._id}
            id={image._id}
            user={image.userId.userName}
            userProfilePic={image.userId.profilePic}
            image={image.url}
            title={image.title}
            description={image.description}
            likes={120}
            comments={15}
          />
        ))}
      </div>
      {hasMore && (
        <div ref={loader} className="py-10 text-center text-gray-500">
          Loading...
        </div>
      )}
    </div>
  );
}
