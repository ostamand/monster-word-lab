import express, { type Request, type Response } from "express";
import {z} from "zod";

import {
    type GenerationInput,
    getGenerationById,
    getRandomGeneration,
    getTodayGenerationsCount,
} from "../models/generations.js";
import configs from "../configs.js";
import { sendGeneration } from "../lib/generations.js";
import { signGenerationOutput } from "../lib/storage.js";

const generationsRouter = express.Router();

export const RandomGenerationSchema = z.object({
  excludeIds: z.array(z.string()).default([]),
  language: z.enum(["en", "es", "fr"]).optional(),
  age: z.number().int().min(3).optional(), 
});

generationsRouter.post("/random", async (req: Request, res: Response) => {
    try {
        const validation = RandomGenerationSchema.safeParse(req.body);
        if (!validation.success) {
            const errorTree = z.treeifyError(validation.error);
            return res.status(400).json({
                message: "Invalid request data",
                errors: errorTree, 
            });
        }

        const { excludeIds, language, age } = validation.data;

        const randomGen = await getRandomGeneration(
            excludeIds,
            { language, age },
        );

        if (randomGen) {
            return res.json(await signGenerationOutput(randomGen));
        } else {
            return res.status(404).json({ message: "No generation found." });
        }
    } catch (error) {
        console.error("Error in /random route:", error);
        return res.status(500).json({
            message: "Something went wrong, could not fetch random generation.",
        });
    }
});

generationsRouter.get("/count/today", async (req: Request, res: Response) => {
    const count = await getTodayGenerationsCount();
    if (count !== null) {
        return res.json({ count });
    } else {
        res.status(500).json({
            message: "Something went wrong, could not connect to database.",
        });
    }
});

type GenerateResponse = {
    id: string;
    final_image_gcs_path: string | undefined;
    final_audio_gcs_path: string | undefined;
};

generationsRouter.post("/", async (req: Request, res: Response) => {
    const data = req.body as GenerationInput;
    if (!data) {
        return res.status(400).json({ message: "Bad request for generation." });
    }

    // mock generation flow (mostly for dev). will return a random already existing generation
    if (configs.mockGeneration) {
        const randomGeneration = await getRandomGeneration();

        if (!randomGeneration) {
            return res.status(500).json({
                message: "Something went wrong, could not connect to database.",
            });
        }

        const randomReponse: GenerateResponse = {
            id: randomGeneration.id,
            final_image_gcs_path: randomGeneration.final_image_gcs_path,
            final_audio_gcs_path: randomGeneration.final_audio_gcs_path,
        };

        return res.status(200).json(randomReponse);
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

generationsRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "ID parameter is required.",
            });
        }

        const generation = await getGenerationById(id as string);

        if (generation) {
            return res.json(generation);
        } else {
            return res.status(404).json({
                message: `Generation with ID ${id} not found.`,
            });
        }
    } catch (error) {
        console.error(
            `Error in GET /generations/${req.params.id} route:`,
            error,
        );
        return res.status(500).json({
            message: "Something went wrong while fetching the generation.",
        });
    }
});

export default generationsRouter;
