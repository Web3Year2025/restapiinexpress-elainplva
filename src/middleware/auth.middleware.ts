import { Request, Response, NextFunction } from "express";
import { verify as jwtVerify, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-use-a-real-secret-in-env';

// Extend Express Request type so req.user is available in controllers
declare global {
    namespace Express {
        interface Request {
            user?: {
                sub: string;
                email: string;
                role: string;
                name: string;
            };
        }
    }
}

// Helper: safely extract a string from a JWT claim (which may be string | string[])
const extractString = (claim: string | string[] | undefined): string => {
    if (!claim) return '';
    return Array.isArray(claim) ? claim[0] : claim;
};

export const validJWTProvided = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // jwtVerify returns string | JwtPayload — we cast to JwtPayload
        const decoded = jwtVerify(token, JWT_SECRET) as JwtPayload;

        // Safely extract each claim as a plain string
        req.user = {
            sub:   extractString(decoded['sub']),
            email: extractString(decoded['email']),
            role:  extractString(decoded['role']) || 'user',
            name:  extractString(decoded['name']),
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Must be used AFTER validJWTProvided in the middleware chain
export const isAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }

    next();
};