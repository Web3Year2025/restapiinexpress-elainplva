import { ObjectId } from "mongodb";
import { z } from "zod";

type role = "admin" | "editor" | "";

export interface User {
    name: string;
    phonenumber: string;
    email: string;
    id?: ObjectId;
    dateJoined?: Date;
    lastUpdated?: Date;
    password?: string;
    hashedPassword?: string;
    role?: role;
}

export const createUserSchema = z.object({
    name: z.string().min(3),
    phonenumber: z.string().optional().default(''),
    email: z.string().email(),
    password: z.string().min(6).max(64),
    role: z.enum(["admin", "editor", ""]).optional().default("")
}).strict();

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
}).strict();