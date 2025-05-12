"use server";

import { getServerSession } from "next-auth";
import { dbConnect } from "../mongo";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Album } from "@/model/album-model";
import { albumSchema } from "../validationSchema";
import { Photo } from "@/model/photo-model";

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

export async function getAlbumById(id) {
  try {
    await dbConnect();
    const album = await Album.findById(id);
    const albumDto = {
      name: album.name,
      description: album.description,
    };
    return {
      success: true,
      album: albumDto,
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
