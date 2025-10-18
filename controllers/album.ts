import { Request, Response } from 'express';
import { collections } from '../src/database';
import { Album } from '../src/models/album';
import { ObjectId } from 'mongodb';
import { createAlbumSchema } from '../src/models/album';
import { date } from 'zod';


// Get all albums
export const getAlbums = async (req: Request, res: Response) => {
  try {
    const albums = (await collections.albums?.find({}).toArray()) as unknown as Album [];
    res.status(200).send(albums);
  } catch (error) {
    if (error instanceof Error)
    {
     console.log(`issue with inserting ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
    res.status(500).send("Unable to fetch albums");
  }
};

// Get one album by ID
export const getAlbumById = async (req: Request, res: Response) => {
  let id: string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const album = (await collections.albums?.findOne({ query })) as unknown as Album;
    if (album)  {
    res.status(200).send(album);
    }
  } catch (error){
    if (error instanceof Error)
    {
     console.log(`issue with inserting ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
    res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
  }
};

// Create new album
export const createAlbum = async (req: Request, res: Response) => {
  console.log(req.body);
  const validation = createAlbumSchema.safeParse(req.body);

  const { title, artist, rating, acquiredDate, isBorrowed, owner } = req.body;
  const newAlbum: Album = {title: title, artist: artist, rating: rating, acquiredDate: new Date(), isBorrowed: isBorrowed, owner: owner};

  try {
    const result = await collections.albums?.insertOne(newAlbum);
    if (result) {
      res.status(201).location(`${result.insertedId}`).json({ message: `Created a new album with id ${result.insertedId}` })
    }
    else {
      res.status(500).send("Failed to create a new album.");
    }
  } catch (error) {
    if (error instanceof Error)
    {
     console.log(`issue with inserting ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
    res.status(400).send(`Unable to create new album.`);
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