import express, { Router } from 'express';
import { validate } from '../src/middleware/validate.middleware';
import { createAlbumSchema } from '../src/models/album';
import {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} from '../controllers/album';


const router: Router = express.Router();

router.get('/', getAlbums);
router.get('/:id', getAlbumById);
router.post('/', validate(createAlbumSchema), createAlbum);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

export default router;
