import cloudinary from "../cloudinary";

export async function deleteImageFromCloudinary(imgUrl) {
  try {
    const publicIdMatch = imgUrl.match(/\/v\d+\/([^/.]+)\./);
    const publicId = publicIdMatch ? publicIdMatch[1] : null;
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);
    return { message: "Image deleted" };
  } catch (e) {
    console.log(e);
    return { error: "The image has not beet deleted" };
  }
}
