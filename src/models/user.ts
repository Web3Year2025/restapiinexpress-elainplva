import { ObjectId } from "mongodb";
import { z } from "zod";

export interface User {
    name: string;
    phonenumber: string;
    email: string;
    id?: ObjectId;
    dateJoined?: Date;
    lastUpdated?: Date;
    password?: string;
    hashedPassword?: string;
}

export const createUserSchema = z.object({
    name: z.string().min(3),
    phonenumber: z.string().min(10),
    email: z.string().email(),
    password: z.string().min(8).max(64),
}).strict();

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
}).strict();
