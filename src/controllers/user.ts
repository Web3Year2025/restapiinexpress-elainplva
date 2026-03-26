import { Request, Response } from 'express';
import { collections } from '../database';
import { User } from '../models/user';
import * as argon2 from 'argon2';
import { ObjectId } from 'mongodb';

// Admin only - update a user's role
export const updateUserRole = async (req: Request, res: Response) => {
  const id = req.params['id'] as string;
  const { role } = req.body;

  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Role must be admin or user' });
  }

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user id format' });
    }

    const result = await collections.users?.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role, lastUpdated: new Date() } }
    );

    if (result?.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `User role updated to ${role}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update role' });
  }
};

export const createUser = async (req: Request, res: Response) => {
    const { name, phonenumber, email, password, role } = req.body;

    try {
        // Check if email already exists
        const existingUser = await collections.users?.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Hash the password before storing
        const hashedPassword = await argon2.hash(password);

        // Create new user with role and hashed password
        const newUser: User = {
            name: name,
            phonenumber: phonenumber || '',
            email: email.toLowerCase(),
            hashedPassword: hashedPassword,
            role: role || 'user',
            dateJoined: new Date(),
            lastUpdated: new Date(),
        };

        const result = await collections.users?.insertOne(newUser);

        if (result) {
            return res.status(201).json({
                message: `User created successfully`,
                userId: result.insertedId
            });
        } else {
            return res.status(500).json({
                message: "Failed to create user"
            });
        }

    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            message: "Failed to create user"
        });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        // Never return hashedPassword to the client
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
    const id = req.params['id'] as string;

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
    const id = req.params['id'] as string;

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

export const deleteUserByEmail = async (req: Request, res: Response) => {
    const email = req.params['email'] as string;

    try {
        const result = await collections.users?.deleteOne({
            email: email.toLowerCase()
        });

        if (result?.deletedCount === 0) {
            return res.status(404).json({
                message: `No user found with email: ${email}`
            });
        }

        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            message: "Unable to delete user"
        });
    }
};