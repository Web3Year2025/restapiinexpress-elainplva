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

  if (!validation.success) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validation.error.issues
    });
  }

  const { title, artist, rating, acquiredDate, isBorrowed, owner } = req.body;
  const newAlbum: Album = {title: title, artist: artist, rating: rating, acquiredDate: new Date(), 
    isBorrowed: isBorrowed, owner: owner};

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
 console.log(req.body); //for now just log the data

  res.json({"message": `update album ${req.params.id} with data from the post message`})
};

// Delete album
export const deleteAlbum = async (req: Request, res: Response) => {
  res.json({"message": `delete album ${req.params.id}`})
};