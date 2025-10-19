"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collections = void 0;
exports.initDb = initDb;
exports.closeDb = closeDb;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectionString = process.env.DB_CONN_STRING || "";
const dbName = process.env.DB_NAME || "WebAssignment_2025";
const client = new mongodb_1.MongoClient(connectionString);
exports.collections = {};
if (connectionString == "") {
    throw new Error("No connection string  in .env");
}
let db;
async function initDb() {
    try {
        await client.connect();
        db = client.db(dbName);
        const albumsCollection = db.collection('users');
        exports.collections.albums = albumsCollection;
        console.log('connected to database');
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`issue with db connection ${error.message}`);
        }
        else {
            console.log(`error with ${error}`);
        }
    }
}
async function closeDb() {
    await client.close();
    console.log("Database connection closed");
}
