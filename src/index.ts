import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import albumRoutes from './routes/albums';
import dotenv from 'dotenv';
import { initDb } from './database';

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

const app: Application = express();
app.use(morgan("tiny"));
app.use(express.json());
app.use('/api/v1/albums', albumRoutes);
app.get("/ping", async (_req: Request, res: Response) => {
    res.json({
<<<<<<< HEAD
        message: "hello from Elain Polakova s00250500",
=======
    message: "Album endpoint implemented",
>>>>>>> d530800d06f7e813b84c75e7302bd8224d895fa8
    });
});


initDb();
export { app };