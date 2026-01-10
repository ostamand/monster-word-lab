import express, { type Request, type Response } from "express";

import {
    getLatestGeneration,
    getTodayGenerationsCount,
} from "../models/generations.js";
import configs from "../configs.js";
import { type GenerationInput } from "../models/generations.js";
import { sendGeneration } from "../lib/generations.js";

const generationsRouter = express.Router();

generationsRouter.get("/", async (req: Request, res: Response) => {
    const { count: paramsCount } = req.query;
    if (paramsCount === "today") {
        // only want count
        const count = await getTodayGenerationsCount();
        if (count) {
            return res.json({ count });
        } else {
            res.status(500).json({
                message: "Something went wrong, could not connect to database.",
            });
        }
    }
});

generationsRouter.post("/", async (req: Request, res: Response) => {
    const data = req.body as GenerationInput;
    if (!data) {
        return res.status(400).json({ message: "Bad request for generation." });
    }

    const currentCount = await getTodayGenerationsCount();

    if (!currentCount) {
        return res.status(500).json({
            message: "Something went wrong, could not connect to database.",
        });
    }

    if (currentCount >= configs.dailyGenerationsQuota) {
        return res.status(429).json({
            message: "Daily generation limit reached. Try again tommorow.",
        });
    }

    // ok to generate
    const generationOutput = await sendGeneration(data);
    if (!generationOutput) {
        return res.status(500).json({
            message: "Something went wrong, failed generation request.",
        });
    }

    return res.status(200).json(generationOutput);
});

export default generationsRouter;

/* const response = await fetch("http://localhost:3000/generations", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(
        { gender: "m", age: 6, language: "fr", theme: null, targetWord: null },
    ),
});
 */
