import express, { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { createAlbumSchema } from '../models/album';
import {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  searchAlbums
} from '../controllers/album';
import { validJWTProvided } from '../middleware/auth.middleware';


const router: Router = express.Router();

router.get('/', getAlbums);
router.get('/search', searchAlbums);
router.get('/:id', getAlbumById);
router.post('/', validJWTProvided, validate(createAlbumSchema), createAlbum);
router.put('/:id', validJWTProvided, validate(createAlbumSchema), updateAlbum);
router.delete('/:id', validJWTProvided, deleteAlbum);

export default router;
