import express, { Router } from 'express';
import { searchAlbumsLastFm, getAlbumDetailsLastFm, getTrendingAlbums } from '../controllers/lastfm';

const router: Router = express.Router();

// Both routes are PUBLIC — no JWT required
router.get('/search', searchAlbumsLastFm);
router.get('/details', getAlbumDetailsLastFm);
router.get('/trending', getTrendingAlbums);

export default router;