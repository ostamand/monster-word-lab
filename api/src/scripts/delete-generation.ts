import { Storage } from "@google-cloud/storage";
import { db } from "../models/database.js";
import configs from "../configs.js";

async function deleteGeneration(id: string) {
    if (!id) {
        console.error("Please provide a generation ID as an argument.");
        process.exit(1);
    }

    console.log(`Deleting generation ${id}...`);

    // 1. Delete from Firestore
    try {
        const docRef = db.collection(configs.generationCollection).doc(id);
        const doc = await docRef.get();

        if (doc.exists) {
            await docRef.delete();
            console.log(`- Firestore document ${id} deleted.`);
        } else {
            console.log(`- Firestore document ${id} not found, skipping.`);
        }
    } catch (error) {
        console.error(`- Failed to delete Firestore document: ${error}`);
    }

    // 2. Delete from GCS
    const storage = new Storage({
        keyFilename: "service-account.json",
    });
    const bucket = storage.bucket(configs.assetsBucketName);

    const filesToDelete = [
        `raw/${id}.png`,
        `composed/${id}.png`,
        `audio/${id}.mp3`,
    ];

    for (const filePath of filesToDelete) {
        try {
            await bucket.file(filePath).delete();
            console.log(`- GCS file ${filePath} deleted.`);
        } catch (error: any) {
            if (error.code === 404) {
                console.log(`- GCS file ${filePath} not found, skipping.`);
            } else {
                console.error(
                    `- Failed to delete GCS file ${filePath}: ${error.message}`,
                );
            }
        }
    }
    console.log("Deletion complete.");
}

const generationId = process.argv[2];
if (!generationId) {
    console.error("Usage: npm run delete-generation <id>");
    process.exit(1);
}

deleteGeneration(generationId).catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
