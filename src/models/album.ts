import { ObjectId } from "mongodb";
import { z } from "zod";

export interface Album {
  id?: ObjectId;
  title: string;
  artist: string;
  rating?: number;
  acquiredDate: Date;
  isBorrowed: boolean;
  owner?: string;
    

}

export const createAlbumSchema = z.object({
  title: z.string().min(1, "Album title is required"),
  artist: z.string().min(1, "Artist name is required"),
  rating: z.number().min(1).max(5).optional(),
  acquiredDate: z.coerce.date(),
  isBorrowed: z.boolean(),
  owner: z.string().optional(),
  
});

