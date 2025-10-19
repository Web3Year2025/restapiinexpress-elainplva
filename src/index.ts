import express, {Application, Request, Response} from "express";
import morgan from "morgan";
import albumRoutes from '../routes/albums';
import dotenv from 'dotenv';
import { initDb } from './database';

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

const app: Application = express();
app.use(morgan("tiny"));
app.use(express.json());
app.use('/api/v1/albums', albumRoutes);
app.get("/ping", async (_req : Request, res: Response) => {
    res.json({
    message: "Album endpoint implemented",
    });
});


initDb();
export { app };