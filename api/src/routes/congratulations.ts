
import express, { type Request, type Response } from "express";
import { z } from "zod";

import configs from "../configs.js";
import { getSignedUrl, listFolder } from "../lib/storage.js";

const congratulationsRouter = express.Router();

export const CongratulationsSchema = z.object({
    language: z.enum(["en", "es", "fr"]).optional(),
});

congratulationsRouter.get("/random", async (req: Request, res: Response) => {
    try {
        const validation = CongratulationsSchema.safeParse(req.query);

        if (!validation.success) {
            return res.status(400).json({
                message: "Invalid language parameter",
            });
        }

        const language = validation.data.language || "en";
        const bucketName = configs.assetsBucketName;
        // Prefix structure: congratulations/en/
        const prefix = `congratulations/${language}/`;

        const files = await listFolder(bucketName, prefix);
        const videos = files.filter((f) => f.endsWith(".mp4"));

        if (videos.length === 0) {
            return res.status(404).json({
                message: "No videos found for this language",
            });
        }

        const randomVideo = videos[Math.floor(Math.random() * videos.length)];

        if (!randomVideo) {
            return res.status(500).json({
                message: "Error selecting random video",
            });
        }

        const signedUrl = await getSignedUrl(bucketName, randomVideo);

        if (!signedUrl) {
            return res.status(500).json({
                message: "Failed to sign video URL",
            });
        }

        return res.json({ url: signedUrl });
    } catch (error) {
        console.error("Error in /congratulations/random:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
});

export default congratulationsRouter;
