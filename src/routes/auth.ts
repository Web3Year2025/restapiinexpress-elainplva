import express, { Router } from 'express';
import { handleLogin } from '../controllers/auth';
import { validate } from '../middleware/validate.middleware';
import { loginSchema } from '../models/user';

const router: Router = express.Router();

router.get('/', (_req, res) => {
    res.status(200).json({
        message: 'Auth endpoint - POST login credentials to authenticate',
        endpoints: {
            'POST /api/v1/auth': 'Login endpoint',
            'POST /api/v1/auth/login': 'Login endpoint (alternative)'
        }
    });
});

router.post('/login', validate(loginSchema), handleLogin);
router.post('/', validate(loginSchema), handleLogin);

export default router;
