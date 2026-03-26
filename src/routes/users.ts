import express, { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { createUserSchema } from '../models/user';
import { createUser, getUsers, getUserById, deleteUser, deleteUserByEmail, updateUserRole } from '../controllers/user';
import { validJWTProvided, isAdmin } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Public - anyone can register
router.post('/', validate(createUserSchema), createUser);

// Protected - must be logged in
router.get('/', validJWTProvided, isAdmin, getUsers);
router.get('/:id', validJWTProvided, getUserById);
router.delete('/email/:email', validJWTProvided, isAdmin, deleteUserByEmail);
router.delete('/:id', validJWTProvided, isAdmin, deleteUser);
// Protected - only admin can update user roles
router.patch('/:id/role', validJWTProvided, isAdmin, updateUserRole);
export default router;