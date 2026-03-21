import { ObjectId } from "mongodb";
import { z } from "zod";

export type Role = "admin" | "user";

export interface User {
    name: string;
    phonenumber: string;
    email: string;
    id?: ObjectId;
    dateJoined?: Date;
    lastUpdated?: Date;
    hashedPassword?: string;
    role?: Role;
}

export const createUserSchema = z.object({
    name: z.string().min(3),
    phonenumber: z.string().optional().default(''),
    email: z.string().email(),
    password: z.string().min(6).max(64),
    role: z.enum(["admin", "user"]).optional().default("user")
}).strict();

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
}).strict();