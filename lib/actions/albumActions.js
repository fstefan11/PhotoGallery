"use server";

import { getServerSession } from "next-auth";
import { dbConnect } from "../mongo";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Album } from "@/model/album-model";
import { albumSchema } from "../validationSchema";
import { Photo } from "@/model/photo-model";
import Photos from "@/app/photos/page";
import mongoose from "mongoose";

export async function createAlbum(formData, images) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        success: false,
        message: "Access forbidden",
        statusCode: 403,
      };
    }

    albumSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
    });
    const newAlbum = new Album({
      name: formData.get("name"),
      description: formData.get("description"),
      userId: session.user.id,
    });
    const album = await newAlbum.save();
    await Photo.updateMany(
      { _id: { $in: images.map((img) => img.id) } },
      { $set: { albumId: album._id } }
    );
    return {
      success: true,
      message: "Album created",
      statusCode: 201,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Internal server error",
      statusCode: 500,
    };
  }
}

export async function getUserAlbums() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        success: false,
        message: "Access forbidden",
        statusCode: 403,
      };
    }
    const albums = await Album.find({ userId: session.user.id });
    const thumbnails = await Photo.aggregate([
      {
        $match: { albumId: { $in: albums.map((a) => a._id) } },
      },
      {
        $group: {
          _id: "$albumId",
          coverImageUrl: { $first: "$url" },
        },
      },
    ]);
    const thumbnailMap = new Map(
      thumbnails.map((t) => [t._id.toString(), t.coverImageUrl])
    );

    const albumsDto = albums.map((album) => ({
      id: JSON.parse(JSON.stringify(album._id)),
      title: album.name,
      description: album.description,
      coverImageUrl: thumbnailMap.get(album._id.toString()) || null,
    }));

    return {
      success: true,
      albums: albumsDto,
      statusCode: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal server error",
      statusCode: 500,
    };
  }
}

export async function getAlbumsByUserId(id) {
  try {
    await dbConnect();
    const albums = await Album.find({ userId: id });
    const thumbnails = await Photo.aggregate([
      {
        $match: { albumId: { $in: albums.map((a) => a._id) } },
      },
      {
        $group: {
          _id: "$albumId",
          coverImageUrl: { $first: "$url" },
        },
      },
    ]);
    const thumbnailMap = new Map(
      thumbnails.map((t) => [t._id.toString(), t.coverImageUrl])
    );

    const albumsDto = albums.map((album) => ({
      _id: JSON.parse(JSON.stringify(album._id)),
      title: album.name,
      description: album.description,
      coverImageUrl: thumbnailMap.get(album._id.toString()) || null,
    }));

    return {
      success: true,
      albums: albumsDto,
      statusCode: 200,
    };
  } catch (error) {
    // console.log(error);
    return {
      success: false,
      message: "Internal server error",
      statusCode: 500,
    };
  }
}

export async function getAlbumById(id) {
  try {
    await dbConnect();
    const album = await Album.findById(id).populate("userId");
    return {
      success: true,
      album: JSON.parse(JSON.stringify(album)),
      statusCode: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal server error",
      statusCode: 500,
    };
  }
}

export async function removePhotoFromAlbum(id) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const photo = await Photo.findById(id);
    if (!session || session.user.id != photo.userId) {
      return {
        success: false,
        message: "Access forbidden",
        statusCode: 403,
      };
    }
    photo.albumId = null;
    await photo.save();
    return {
      success: true,
      message: "Photo removed from album",
      statusCode: 204,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal server error",
      statusCode: 500,
    };
  }
}

export async function addPhotosToAlbum(photos, albumId) {
  try {
    if (photos.length == 0)
      return {
        success: false,
        message: "No photos provided",
        statusCode: 400,
      };
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (
      !session ||
      photos.some((photo) => photo.userId.toString() != session.user.id)
    ) {
      return {
        success: false,
        message: "Access forbidden",
        statusCode: 403,
      };
    }
    const photoIds = photos.map((photo) => photo._id);

    await Photo.updateMany(
      { _id: { $in: photoIds } },
      { $set: { albumId: albumId } }
    );
    const photosInAlbum = await Photo.find({ albumId: albumId });

    return {
      success: true,
      photos: JSON.parse(JSON.stringify(photosInAlbum)),
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

export async function deleteAlbum(id) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const album = await Album.findById(id);
    console.log(album);
    if (!session || session.user.id != album.userId.toString()) {
      return {
        success: false,
        message: "Access forbidden",
        statusCode: 403,
      };
    }
    await Photo.updateMany(
      { albumId: new mongoose.Types.ObjectId(id) },
      { $set: { albumId: null } }
    );
    await Album.findByIdAndDelete(id);

    return {
      success: true,
      message: "Album deleted",
      statusCode: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal server error",
      statusCode: 500,
    };
  }
}
