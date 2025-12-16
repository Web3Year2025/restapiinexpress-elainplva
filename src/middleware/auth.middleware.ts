import { Request, Response, NextFunction } from "express";
import { verify as jwtVerify } from 'jsonwebtoken';

export const validJWTProvided = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader?.startsWith('Bearer')) {
        console.log('No authorization header or not Bearer token: ' + authHeader);
        return res.status(401).json({ message: 'Missing or invalid authorization header' });
    }

    const token: string | undefined = authHeader.split(' ')[1];

    if (!token) {
        console.log('No token found in authorization header');
        return res.status(401).json({ message: 'No token provided' });
    }

    const secret = process.env.JWTSECRET || "not very secret";

    try {
        console.log('Verifying token...');
        const payload = jwtVerify(token, secret);
        res.locals.payload = payload;
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
