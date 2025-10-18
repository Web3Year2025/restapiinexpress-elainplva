import { Request, Response } from 'express';
import { collections } from '../src/database';
import { Album } from '../src/models/album';
import { ObjectId } from 'mongodb';
import { createAlbumSchema } from '../src/models/album';
import { date } from 'zod';


// Get all albums
export const getAlbums = async (req: Request, res: Response) => {
  try {
    const albums = (await collections.albums?.find({}).toArray()) as Album[];
    res.status(200).send(albums);
  } catch (error) {
    res.status(500).send("Unable to fetch albums");
  }
};

// Get one album by ID
export const getAlbumById = async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id);
    const album = await collections.albums?.findOne({ _id: id });
    if (!album) return res.status(404).send("Album not found");
    res.status(200).send(album);
  } catch {
    res.status(400).send("Invalid ID");
  }
};

// Create new album
export const createAlbum = async (req: Request, res: Response) => {
  const { title, artist, rating, acquiredDate, isBorrowed, owner } = req.body;
  const newAlbum: Album = {
    title,
    artist,
    rating,
    acquiredDate: new Date(acquiredDate),
    isBorrowed,
    owner,
  };

  try {
    const result = await collections.albums?.insertOne(newAlbum);
    res
      .status(201)
      .location(`${result?.insertedId}`)
      .json({ message: `Created album ${title} with ID ${result?.insertedId}` });
  } catch {
    res.status(400).send("Unable to create new album");
  }
};

// Update album
export const updateAlbum = async (req: Request, res: Response) => {
  const id = new ObjectId(req.params.id);
  const update = { $set: req.body };

  try {
    const result = await collections.albums?.updateOne({ _id: id }, update);
    result?.matchedCount
      ? res.status(200).send("Album updated")
      : res.status(404).send("Album not found");
  } catch {
    res.status(400).send("Update failed");
  }
};

// Delete album
export const deleteAlbum = async (req: Request, res: Response) => {
  const id = new ObjectId(req.params.id);
  try {
    const result = await collections.albums?.deleteOne({ _id: id });
    result?.deletedCount
      ? res.status(200).send("Album deleted")
      : res.status(404).send("Album not found");
  } catch {
    res.status(400).send("Delete failed");
  }
};