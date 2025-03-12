"use server";

import cloudinary from "../cloudinary";

export async function deleteImageFromCloudinary(imgUrl) {
  try {
    const publicIdMatch = imgUrl.match(/\/v\d+\/([^/.]+)\./);
    const publicId = publicIdMatch ? publicIdMatch[1] : null;
    const result = await cloudinary.uploader.destroy(publicId);
    return { message: "Image deleted" };
  } catch (e) {
    console.log(e);
    return { error: "The image has not beet deleted" };
  }
}

export async function uploadToCloudinary(formData) {
  const blob = formData.get("image");
  const buffer = Buffer.from(await blob.arrayBuffer());

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, function (error, result) {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        })
        .end(buffer);
    });
    return result;
  } catch (e) {
    console.error("Eroare la adaugarea fotografiei: ", e);
    return;
  }
}
