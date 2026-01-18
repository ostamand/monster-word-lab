import { Storage } from "@google-cloud/storage";

import { type GenerationOutput } from "../models/generations.js";

const storage = new Storage({
    keyFilename: "service-account.json",
});

const expiration = Date.now() + 1000 * 60 * 60; // 1 hour

export async function getSignedUrl(
    bucketName: string,
    filePath: string,
): Promise<string | undefined> {
    try {
        const [url] = await storage
            .bucket(bucketName)
            .file(filePath)
            .getSignedUrl({
                action: "read",
                expires: expiration,
            });

        return url;
    } catch (e) {
        console.error(
            `Failed to sign URL for gs://${bucketName}/${filePath}`,
            e,
        );
        return undefined;
    }
}

export async function listFolder(
    bucketName: string,
    prefix: string,
): Promise<string[]> {
    try {
        const [files] = await storage.bucket(bucketName).getFiles({
            prefix,
        });
        return files.map((f) => f.name);
    } catch (error) {
        console.error(`Failed to list folder ${prefix} in ${bucketName}`, error);
        return [];
    }
}

export async function signGenerationOutput(
    output: GenerationOutput,
): Promise<GenerationOutput> {
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

            return await getSignedUrl(bucketName, filePath);
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
