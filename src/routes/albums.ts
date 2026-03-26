import express, { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { createAlbumSchema } from '../models/album';
import {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  searchAlbums,
  adminDeleteAlbum
} from '../controllers/album';
import { isAdmin, validJWTProvided } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Public routes - anyone can read albums
router.get('/', getAlbums);
router.get('/search', searchAlbums);
router.get('/:id', getAlbumById);

// Protected routes - must be logged in to write
router.post('/', validJWTProvided, validate(createAlbumSchema), createAlbum);
router.put('/:id', validJWTProvided, validate(createAlbumSchema), updateAlbum);
router.delete('/:id', validJWTProvided, deleteAlbum);

// Admin only - delete any album
router.delete('/admin/:id', validJWTProvided, isAdmin, adminDeleteAlbum);

export default router;