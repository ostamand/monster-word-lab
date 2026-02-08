import fs from "fs";
import { db } from "../models/database.js";
import configs from "../configs.js";
import type { GenerationOutput } from "../models/generations.js";

async function findGenerationsWithCurieux() {
    console.log("Searching for generations containing 'curieux'...");

    const collectionRef = db.collection(configs.generationCollection);
    const snapshot = await collectionRef.get();

    const results: { id: string; sentence: string }[] = [];

    snapshot.forEach((doc) => {
        const data = doc.data() as GenerationOutput;
        const sentence = data.pedagogicalOutput?.sentence;

        if (sentence && sentence.toLowerCase().includes("curieux")) {
            results.push({
                id: doc.id,
                sentence: sentence,
            });
        }
    });

    const outputFile = "curieux_generations.json";
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));

    console.log(`Found ${results.length} generations.`);
    console.log(`Results saved to ${outputFile}`);
}

findGenerationsWithCurieux().catch((err) => {
    console.error("Error:", err);
    process.exit(1);
});
