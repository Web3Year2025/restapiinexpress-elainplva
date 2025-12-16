import express, { Router } from 'express';
import { handleLogin } from '../controllers/auth';
import { validate } from '../middleware/validate.middleware';
import { loginSchema } from '../models/user';

const router: Router = express.Router();

router.post('/', validate(loginSchema), handleLogin);

export default router;
