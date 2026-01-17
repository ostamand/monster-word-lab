import { Storage } from "@google-cloud/storage";

import { type GenerationOutput } from "../models/generations.js";

const storage = new Storage({
    keyFilename: "service-account.json",
});

export async function signGenerationOutput(
    output: GenerationOutput,
): Promise<GenerationOutput> {
    const expiration = Date.now() + 1000 * 60 * 60; // 1 hour

    // Helper to parse gs:// URI and sign
    const signFile = async (gcsUri: string | undefined) => {
        if (!gcsUri) return undefined;

        if (gcsUri.startsWith("http://") || gcsUri.startsWith("https://")) {
            return gcsUri;
        }

        try {
            // Regex to extract bucket and file path from "gs://bucket-name/path/to/file.ext"
            const match = gcsUri.match(/^gs:\/\/([^\/]+)\/(.+)$/);

            if (!match) {
                console.warn(`Invalid GCS URI format: ${gcsUri}`);
                return undefined;
            }

            const [, bucketName, filePath] = match;

            if (!bucketName || !filePath) {
                return undefined;
            }

            const [url] = await storage
                .bucket(bucketName)
                .file(filePath)
                .getSignedUrl({
                    action: "read",
                    expires: expiration,
                });

            return url;
        } catch (e) {
            console.error(`Failed to sign URL for ${gcsUri}`, e);
            return undefined;
        }
    };

    const [audioUrl, imageUrl] = await Promise.all([
        signFile(output.final_audio_gcs_path),
        signFile(output.final_image_gcs_path),
    ]);

    return {
        ...output,
        final_audio_gcs_path: audioUrl,
        final_image_gcs_path: imageUrl,
    };
}
