import { Request, Response, NextFunction } from "express";
import { verify as jwtVerify } from 'jsonwebtoken';

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

export const validJWTProvided = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    // Check that the Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the token and attach the decoded payload to req.user
        const decoded = jwtVerify(token, JWT_SECRET) as {
            sub: string;
            email: string;
            role: string;
            name: string;
        };
        req.user = decoded;
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