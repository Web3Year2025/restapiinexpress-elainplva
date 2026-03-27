import serverless from "serverless-http";
import { app } from "./index"; // import your existing Express app
import cors from 'cors';

export const handler = serverless(app);
app.use(cors({
  origin: "*" ,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));