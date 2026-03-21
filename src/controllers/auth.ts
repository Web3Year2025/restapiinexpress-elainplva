import { Request, Response } from 'express';
import { collections } from '../database';
import { User } from '../models/user';
import * as argon2 from 'argon2';
import { sign as jwtSign } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-use-a-real-secret-in-env';

// Extend the User type to include MongoDB's _id field
type UserDocument = User & { _id: ObjectId };

const createAccessToken = (user: UserDocument): string => {
    return jwtSign(
        {
            sub: user._id.toString(),
            email: user.email,
            role: user.role || 'user',
            name: user.name
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

export const handleLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Find user by email (case-insensitive)
        const user = await collections.users?.findOne({
            email: email.toLowerCase()
        }) as UserDocument | null;

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.hashedPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password with argon2
        const passwordValid = await argon2.verify(user.hashedPassword, password);

        if (!passwordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create JWT token
        const token = createAccessToken(user);

        // Return consistent token response - always { token, user }
        return res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || 'user',
                phonenumber: user.phonenumber
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Login failed. Please try again.' });
    }
};