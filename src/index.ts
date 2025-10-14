import express, {Application, Request, Response} from "express";
import morgan from "morgan";
import userRoutes from '../routes/users';
import dotenv from 'dotenv';
import { initDb } from './database';

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

const app: Application = express();
app.use(morgan("tiny"));
app.use(express.json());
app.use('/api/v1/users', userRoutes);
app.get("/ping", async (_req : Request, res: Response) => {
    res.json({
    message: "hello from Elain Polakova s00250500",
    });
});


async function startServer() {
  await initDb();
  app.listen(PORT, () => {
    console.log("PORT from env:", process.env.PORT);
    console.log("Server is running on port", PORT);
  });
}

startServer();