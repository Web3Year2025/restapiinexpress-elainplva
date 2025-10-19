"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_middleware_1 = require("../src/middleware/validate.middleware");
const album_1 = require("../src/models/album");
const album_2 = require("../controllers/album");
const router = express_1.default.Router();
router.get('/', album_2.getAlbums);
router.get('/:id', album_2.getAlbumById);
router.post('/', (0, validate_middleware_1.validate)(album_1.createAlbumSchema), album_2.createAlbum);
router.put('/:id', album_2.updateAlbum);
router.delete('/:id', album_2.deleteAlbum);
exports.default = router;
