import { Request, Response } from 'express';
import { collections } from '../database';
import { Album } from '../models/album';
import { ObjectId } from 'mongodb';
import { createAlbumSchema } from '../models/album';

export const getAlbums = async (req: Request, res: Response) => {
  try {
    const albums = await collections.albums?.find({}).toArray();
    res.status(200).json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(500).send("Unable to fetch albums");
  }
};

export const getAlbumById = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid album id format");
  }

  try {
    const query = { _id: new ObjectId(id) };
    const album = await collections.albums?.findOne(query);

    if (!album) {
      return res.status(404).send(`Unable to find matching document with id: ${id}`);
    }

    res.status(200).json(album);
  } catch (error) {
    console.error("Error retrieving album:", error);
    res.status(500).send("Server error retrieving album");
  }
};

export const createAlbum = async (req: Request, res: Response) => {
  console.log(req.body);

  const validation = createAlbumSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: validation.error.issues
    });
  }

  const validated = validation.data;

  const newAlbum: Album = {
    title: validated.title,
    artist: validated.artist,
    rating: validated.rating,
    acquiredDate: validated.acquiredDate,
    isBorrowed: validated.isBorrowed,
    owner: validated.owner
  };

  try {
    const result = await collections.albums?.insertOne(newAlbum);

    res
      .status(201)
      .location(result!.insertedId.toString())
      .json({ message: `Created a new album with id ${result!.insertedId}` });

  } catch (error) {
    console.error("Error creating album:", error);
    res.status(500).send("Unable to create new album.");
  }
};

export const updateAlbum = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid album id format");
  }

  const validation = createAlbumSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: validation.error.issues
    });
  }

  const updatedData = validation.data;

  try {
    const query = { _id: new ObjectId(id) };
    const update = { $set: updatedData };

    const result = await collections.albums?.updateOne(query, update);

    if (result && result.matchedCount === 0) {
      return res.status(404).send(`Unable to find album with id: ${id}`);
    }

    res.status(200).json({ message: "Album updated successfully" });

  } catch (error) {
    console.error("Error updating album:", error);
    res.status(500).send("Unable to update album.");
  }
};

export const deleteAlbum = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid album id format");
  }

  try {
    const query = { _id: new ObjectId(id) };

    const result = await collections.albums?.deleteOne(query);

    if (result?.deletedCount === 0) {
      return res.status(404).send(`Unable to find album with id: ${id}`);
    }

    res.status(200).json({ message: "Album deleted successfully" });

  } catch (error) {
    console.error("Error deleting album:", error);
    res.status(500).send("Unable to delete album.");
  }
};
