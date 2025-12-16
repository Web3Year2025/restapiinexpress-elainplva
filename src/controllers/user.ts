import { Request, Response } from 'express';
import { collections } from '../database';
import { User } from '../models/user';
import * as argon2 from 'argon2';
import { ObjectId } from 'mongodb';

export const createUser = async (req: Request, res: Response) => {
    const { name, phonenumber, email, password } = req.body;

    try {
        const existingUser = await collections.users?.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const newUser: User = {
            name: name,
            phonenumber: phonenumber,
            email: email.toLowerCase(),
            dateJoined: new Date(),
            lastUpdated: new Date()
        };

        // Hash and salt the password
        newUser.hashedPassword = await argon2.hash(password);

        const result = await collections.users?.insertOne(newUser);

        if (result) {
            return res.status(201)
                .location(`${result.insertedId}`)
                .json({ message: `Created a new user with id ${result.insertedId}` });
        } else {
            return res.status(500).json({ error: "Failed to create a new user." });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(`Error creating user: ${error.message}`);
        } else {
            console.log(`Error creating user: ${error}`);
        }
        res.status(500).json({ error: "Failed to create a new user." });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = (await collections.users
            ?.find({})
            .project({ hashedPassword: 0 })
            .toArray()) as unknown as User[];
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Unable to fetch users" });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = (await collections.users?.findOne(
            { email: id },
            { projection: { hashedPassword: 0 } }
        )) as unknown as User;

        if (!user) {
            return res.status(404).json({ error: `Unable to find user with email: ${id}` });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Unable to fetch user" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user id format" });
        }

        const result = await collections.users?.deleteOne({ _id: new ObjectId(id) });

        if (result?.deletedCount === 0) {
            return res.status(404).json({ error: `Unable to find user with id: ${id}` });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Unable to delete user" });
    }
};
