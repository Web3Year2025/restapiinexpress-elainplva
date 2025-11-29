
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAlbum = exports.updateAlbum = exports.createAlbum = exports.getAlbumById = exports.getAlbums = void 0;
const database_1 = require("../src/database");
const mongodb_1 = require("mongodb");
const album_1 = require("../src/models/album");
// Get all albums
const getAlbums = async (req, res) => {
    try {
        const albums = (await database_1.collections.albums?.find({}).toArray());
        res.status(200).send(albums);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`issue with inserting ${error.message}`);
        }
        else {
            console.log(`error with ${error}`);
        }
        res.status(500).send("Unable to fetch albums");
    }
};
exports.getAlbums = getAlbums;
// Get one album by ID
const getAlbumById = async (req, res) => {
    let id = req.params.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const album = (await database_1.collections.albums?.findOne({ query }));
        if (album) {
            res.status(200).send(album);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`issue with inserting ${error.message}`);
        }
        else {
            console.log(`error with ${error}`);
        }
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
};
exports.getAlbumById = getAlbumById;
// Create new album
const createAlbum = async (req, res) => {
    console.log(req.body);
    const validation = album_1.createAlbumSchema.safeParse(req.body);
    const { title, artist, rating, acquiredDate, isBorrowed, owner } = req.body;
    const newAlbum = { title: title, artist: artist, rating: rating, acquiredDate: new Date(), isBorrowed: isBorrowed, owner: owner };
    try {
        const result = await database_1.collections.albums?.insertOne(newAlbum);
        if (result) {
            res.status(201).location(`${result.insertedId}`).json({ message: `Created a new album with id ${result.insertedId}` });
        }
        else {
            res.status(500).send("Failed to create a new album.");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`issue with inserting ${error.message}`);
        }
        else {
            console.log(`error with ${error}`);
        }
        res.status(400).send(`Unable to create new album.`);
    }
};
exports.createAlbum = createAlbum;
// Update album
const updateAlbum = async (req, res) => {
    console.log(req.body); //for now just log the data
    res.json({ "message": `update album ${req.params.id} with data from the post message` });
};
exports.updateAlbum = updateAlbum;
// Delete album
const deleteAlbum = async (req, res) => {
    res.json({ "message": `delete album ${req.params.id}` });
};
exports.deleteAlbum = deleteAlbum;

// GET /albums/search
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query || "";
    const albums = await Album.find({
      title: { $regex: query, $options: "i" }   
    });

    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
});

