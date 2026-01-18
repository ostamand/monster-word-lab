import express, { type Express, type Request, type Response } from "express";

import cors from "cors";

import generationsRouter from "./routes/generations.js";
import congratulationsRouter from "./routes/congratulations.js";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/generations", generationsRouter);
app.use("/congratulations", congratulationsRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
