import { Request, Response } from 'express';
import { collections } from '../database';
import { User } from '../models/user';
import * as argon2 from 'argon2';
import { sign as jwtSign } from 'jsonwebtoken';

const createAccessToken = (user: User | null): string => {
    const secret = process.env.JWTSECRET || "not very secret";
    const expiresIn = '2h';

    const payload = {
        email: user?.email,
        name: user?.name
    };

    const token = jwtSign(payload, secret, { expiresIn });
    return token;
};

export const handleLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const dummyHash = await argon2.hash("timing_attack_prevention");

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = (await collections.users?.findOne({
            email: email.toLowerCase(),
        })) as unknown as User;

        if (user && user.hashedPassword) {
            const isPasswordValid = await argon2.verify(user.hashedPassword, password);

            if (isPasswordValid) {
                return res.status(200).json({ accessToken: createAccessToken(user) });
            } else {
                await argon2.verify(dummyHash, password);
                return res.status(401).json({ message: 'Invalid email or password!' });
            }
        }

        await argon2.verify(dummyHash, password);
        return res.status(401).json({ message: 'Invalid email or password!' });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Server error during login' });
    }
};
