import express, { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { createUserSchema } from '../models/user';
import { createUser, getUsers, getUserById, deleteUser } from '../controllers/user';
import { validJWTProvided } from '../middleware/auth.middleware';

const router: Router = express.Router();

router.post('/', validate(createUserSchema), createUser);
router.get('/', validJWTProvided, getUsers);
router.get('/:id', validJWTProvided, getUserById);
router.delete('/:id', validJWTProvided, deleteUser);

export default router;
