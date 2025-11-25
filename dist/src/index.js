"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const albums_1 = __importDefault(require("../routes/albums"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("../src/database");
dotenv_1.default.config();
const PORT = Number(process.env.PORT) || 3001;
const app = (0, express_1.default)();
exports.app = app;
app.use((0, morgan_1.default)("tiny"));
app.use(express_1.default.json());
app.use('/api/v1/albums', albums_1.default);
app.get("/ping", async (_req, res) => {
    res.json({
        message: "hello from Elain Polakova s00250500",
    });
});
(0, database_1.initDb)();
