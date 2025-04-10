"use client";

import ImageComponent from "@/components/postPageComponent";
import Providers from "@/components/providersComponent";
import React from "react";

export default function Image({ params }) {
  const id = React.use(params).id;
  if (!id) {
    return <div>Loading...</div>;
  }
  return (
    <Providers>
      <ImageComponent imageId={id} />
    </Providers>
  );
}
