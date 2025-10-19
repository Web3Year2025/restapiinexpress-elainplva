"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAlbumSchema = void 0;
const zod_1 = require("zod");
exports.createAlbumSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    artist: zod_1.z.string().min(1),
    rating: zod_1.z.number().min(1).max(5).optional(),
    acquiredDate: zod_1.z.coerce.date(),
    isBorrowed: zod_1.z.boolean(),
    owner: zod_1.z.string().optional(),
});
