"use server";

import { Photo } from "@/model/photo-model";
import { uploadToCloudinary } from "./cloudinaryActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "../mongo";
import { getUserByUsername } from "./userActions";
import cloudinary from "../cloudinary";
import { postSchema } from "../validationSchema";
import { Like } from "@/model/like-model";
import { Comment } from "@/model/comment-model";

export async function addPhoto(formData) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const response = await uploadToCloudinary(formData);
    const newPhoto = new Photo({
      url: response.secure_url,
      publicId: response.public_id,
      title: formData.get("title"),
      description: formData.get("description"),
      userId: session.user.id,
      isPublic: formData.get("private") === "on" ? false : true,
    });
    try {
      await newPhoto.save();
    } catch (error) {
      await cloudinary.uploader.destroy(response.public_id);
      return {
        success: false,
        message: "Failed to upload photo",
        error: e.message || "Unknown error",
      };
    }

    return {
      success: true,
      message: "Photo uploaded succesfully",
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "Failed to upload photo",
      error: e.message || "Unknown error",
    };
  }
}

export async function deleteImageById(id) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        success: false,
        message: "You don't have access!",
        statusCode: 403,
      };
    }
    const image = await Photo.findById(id);
    if (session.user.id === JSON.parse(JSON.stringify(image.userId))) {
      const response = await cloudinary.uploader.destroy(image.publicId);
      if (response.result != "ok") console.log(response.result);
      if (response.result === "ok") {
        const deletedImage = await Photo.findByIdAndDelete(id);

        if (!deletedImage) {
          return {
            success: false,
            message: "Photo not found",
          };
        }

        return {
          success: true,
          message: "Photo deleted successfully",
        };
      } else {
        return {
          success: false,
          message: "Failed to delete photo",
          error: "Failed to delete photo in Cloudinary",
        };
      }
    } else {
      return {
        success: false,
        message: "Access forbidden",
        statusCode: 403,
      };
    }
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "Failed to delete photo",
      error: e.message || "Unknown error",
    };
  }
}

export async function editImageById(id, formData) {
  try {
    postSchema.parse({
      title: formData.title,
      description: formData.description,
    });
    await dbConnect();
    const session = await getServerSession(authOptions);
    const image = await Photo.findById(id);
    if (session.user.id === JSON.parse(JSON.stringify(image.userId))) {
      if (!image) {
        return {
          success: false,
          message: "Image not found",
          statusCode: 404,
        };
      }

      if (formData.title) image.title = formData.title;
      if (formData.description) image.description = formData.description;
      const updatedImage = await Photo.findByIdAndUpdate(id, image, {
        new: true,
        runValidators: true,
      }).lean();
      updatedImage._id = updatedImage._id.toString();
      return {
        success: true,
        message: "Image updated successfully",
        image: updatedImage,
        statusCode: 200,
      };
    } else {
      return {
        success: false,
        message: "Access forbidden",
        statusCode: 403,
      };
    }
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodErrors) {
      const errors = e.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      return {
        success: false,
        message: errors,
      };
    }
    return {
      success: false,
      message: "Failed to edit Post",
      error: e.message,
    };
  }
}

export async function getPhotosByUsername(username) {
  try {
    await dbConnect();
    const user = await getUserByUsername(username);
    const photos = await Photo.find({ userId: user.id });
    return {
      success: true,
      photos: photos,
    };
  } catch (error) {
    console.error("Error on getting photos by username : ", error);
    return {
      success: false,
      message: "Internal Server Error",
      statusCode: 500,
    };
  }
}

export async function getUserPhotos() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session)
      return {
        success: false,
        message: "Access forbidden",
        statusCode: 403,
      };

    const photos = await Photo.find({ userId: session.user.id });
    return {
      success: true,
      photos: JSON.parse(JSON.stringify(photos)),
      statusCode: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal server error",
      statusCode: 403,
    };
  }
}

export async function getPhotoById(id) {
  try {
    await dbConnect();
    const image = await Photo.findById(id)
      .populate("userId", "userName profilePic")
      .populate("likes")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "userName profilePic",
        },
      })
      .lean({ virtuals: true });
    let transformedImage = image;
    transformedImage.likes = image.likes.map((like) => like.userId);
    transformedImage.comments = image.comments.map((comment) => {
      const user = comment.userId;
      delete comment.userId;
      return { ...comment, user };
    });
    if (!transformedImage)
      return { success: false, message: "Photo not found", statusCode: 404 };
    return {
      success: true,
      image: JSON.parse(JSON.stringify(transformedImage)),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal Server Error",
      statusCode: 500,
    };
  }
}

export async function getPhotos(skip, limit) {
  try {
    await dbConnect();
    const images = await Photo.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "userName profilePic")
      .populate("likes", "userId")
      .populate("comments")
      .lean({ virtuals: true });

    return {
      success: true,
      images: JSON.parse(JSON.stringify(images)),
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal Server Error",
      statusCode: 500,
    };
  }
}

export async function getPhotosByAlbumId(albumId) {
  try {
    await dbConnect();
    const photos = await Photo.find({ albumId: albumId });
    return {
      success: true,
      photos: JSON.parse(JSON.stringify(photos)),
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      statusCode: 500,
    };
  }
}

export async function likePhoto(userId, photoId) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session)
      return {
        success: false,
        message: "Access forbidden",
        statusCode: 403,
      };
    const image = await Photo.findById(photoId);
    if (!image) {
      return {
        success: false,
        message: "Image not found",
        statusCode: 404,
      };
    }
    const existingLike = await Like.findOne({
      photoId: photoId,
      userId: userId,
    });

    if (!existingLike) {
      await Like.create({ photoId, userId });
      const likes = await Like.find({ photoId: photoId });
      const usersLikesArray = likes.map((like) => like.userId);
      return {
        success: true,
        message: "Like added",
        likes: JSON.parse(JSON.stringify(usersLikesArray)),
        statusCode: 200,
      };
    } else {
      await Like.findByIdAndDelete(existingLike._id);
      const likes = await Like.find({ photoId: photoId });
      const usersLikesArray = likes.map((like) => like.userId);

      return {
        success: true,
        message: "Like added",
        likes: JSON.parse(JSON.stringify(usersLikesArray)),
        statusCode: 200,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal server error",
      statusCode: 500,
    };
  }
}

export async function addComment(userId, text, photoId) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session)
      return {
        success: false,
        message: "Access forbidden",
        statusCode: 403,
      };
    let image = await Photo.findById(photoId);
    if (!image) {
      return {
        success: false,
        message: "Image not found",
        statusCode: 404,
      };
    }

    await Comment.create({ photoId, userId, text });

    const comments = await Comment.find({ photoId: photoId })
      .populate("userId", "userName profilePic")
      .lean();

    const transformedComments = comments.map((comment) => {
      const user = comment.userId;
      delete comment.userId;
      return { ...comment, user };
    });
    return {
      success: true,
      comments: JSON.parse(JSON.stringify(transformedComments)),
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal Server Error",
      statusCode: 500,
    };
  }
}

export async function deleteComment(commentId, photoId) {
  try {
    await dbConnect();
    const comment = await Comment.findById(commentId);
    const session = await getServerSession(authOptions);
    if (session.user.id === JSON.parse(JSON.stringify(comment.userId))) {
      const photo = await Photo.findById(photoId);
      if (!photo) throw new Error("Photo not found");

      await Comment.findByIdAndDelete({ _id: commentId });
      const comments = await Comment.find({ photoId: photoId })
        .populate("userId", "userName profilePic")
        .lean();

      const transformedComments = comments.map((comment) => {
        const user = comment.userId;
        delete comment.userId;
        return { ...comment, user };
      });

      return {
        success: true,
        comments: JSON.parse(JSON.stringify(transformedComments)),
        statusCode: 500,
      };
    } else {
      return {
        success: false,
        message: "Access forbidden",
        statusCode: 403,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal Server Error",
      statusCode: 500,
    };
  }
}
