"use client";

import LoadingModal from "@/components/loadingModalComponent";
import ImageComponent from "@/components/postPageComponent";
import Providers from "@/components/providersComponent";
import { getPhotoById } from "@/lib/actions/photoActions";
import React, { useEffect, useState } from "react";

export default function Image({ params }) {
  const id = React.use(params).id;
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await getPhotoById(id);
      if (result.success) {
        setImage(JSON.parse(JSON.stringify(result.image)));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <LoadingModal isLoading={loading} />;
  }
  if (!image) {
    return <div>Image not found!</div>;
  }
  return (
    <Providers>
      <ImageComponent img={image} />
    </Providers>
  );
}
