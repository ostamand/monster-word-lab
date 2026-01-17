import { FieldPath, Timestamp } from "firebase-admin/firestore";

import { db } from "./database.js";
import configs from "../configs.js";
import { signGenerationOutput } from "../lib/storage.js";

type PossibleLanguages = "en" | "es" | "fr";

export type GenerationInput = {
    age: number | null;
    language: PossibleLanguages;
    theme: string | null;
    targetWord: string | null;
};

export type GenerationOutput = {
    completedAt: Timestamp | undefined;
    createdAt: Timestamp;
    final_audio_gcs_path: string | undefined;
    final_image_gcs_path: string | undefined;
    id: string;
    pedagogicalOutput: {
        learningGoal: string;
        sentence: string;
    };
    status: "completed" | "initialized";
    userInput: GenerationInput;
};

export async function getTodayGenerationsCount() {
    try {
        const collectionRef = db.collection(configs.generationCollection);
        const now = new Date();
        const startOfDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
        );

        const snapshot = await collectionRef
            .where("created_at", ">=", startOfDay)
            .count()
            .get();

        const count = snapshot.data().count;

        return count;
    } catch (error) {
        console.error("Error querying database:", error);
        return null;
    }
}

export async function getLatestGeneration() {
    try {
        const snapshot = await db.collection(configs.generationCollection)
            .orderBy(
                "created_at",
                "desc",
            ).limit(1).get();
        if (snapshot.empty) {
            return null;
        }
        const doc = snapshot.docs[0];
        if (doc) {
            const output = { ...doc.data() } as GenerationOutput;
            return output;
        }
        return null;
    } catch (error) {
        console.error("Error getting latest generation", error);
        return null;
    }
}

export async function getGenerationById(
    id: string,
): Promise<GenerationOutput | null> {
    try {
        const docRef = db.collection(configs.generationCollection).doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data();

        const generation = {
            ...data,
        } as GenerationOutput;

        return await signGenerationOutput(generation);
    } catch (error) {
        console.error(`Error getting generation by ID (${id}):`, error);
        return null;
    }
}

export async function getRandomGeneration(
    excludeIds: string[] = [],
    filters: {
        age?: number | null | undefined;
        language?: PossibleLanguages | undefined;
    } = {},
): Promise<GenerationOutput | null> {
    try {
        const collectionRef = db.collection(configs.generationCollection);

        let baseQuery: FirebaseFirestore.Query = collectionRef;

        if (filters.language) {
            baseQuery = baseQuery.where(
                "userInput.language",
                "==",
                filters.language,
            );
        }

        if (filters.age !== undefined && filters.age !== null) {
            baseQuery = baseQuery.where("userInput.age", "==", filters.age);
        }

        // Helper to process snapshot
        const findValidDoc = (snapshot: FirebaseFirestore.QuerySnapshot) => {
            for (const doc of snapshot.docs) {
                if (!excludeIds.includes(doc.id)) {
                    return { ...doc.data(), id: doc.id } as GenerationOutput;
                }
            }
            return null;
        };

        const MAX_RETRIES = 5;
        let attempts = 0;

        // 1. Hybrid Strategy - Phase A: Random Sampling
        // Efficient for low-to-medium saturation (e.g. < 80% excluded)
        while (attempts < MAX_RETRIES) {
            const randomKey = collectionRef.doc().id;

            const snapshotHigh = await baseQuery
                .where(FieldPath.documentId(), ">=", randomKey)
                .limit(20)
                .get();

            let validDoc = findValidDoc(snapshotHigh);
            if (validDoc) return await signGenerationOutput(validDoc);

            const snapshotLow = await baseQuery
                .where(FieldPath.documentId(), "<", randomKey)
                .limit(20)
                .get();

            validDoc = findValidDoc(snapshotLow);
            if (validDoc) return await signGenerationOutput(validDoc);

            attempts++;
        }

        // 2. Hybrid Strategy - Phase B: Fallback Batch Scan
        // If we reach here, the space is likely highly saturated (e.g. > 90% excluded).
        // We fetch a larger batch of candidates and filter in memory to find the needle in the haystack.
        console.warn(
            "Random sampling failed (high saturation?), switching to fallback scan.",
        );

        const fallbackSnapshot = await baseQuery.limit(1000).get();
        const validDocs: GenerationOutput[] = [];

        for (const doc of fallbackSnapshot.docs) {
            if (!excludeIds.includes(doc.id)) {
                validDocs.push({ ...doc.data(), id: doc.id } as GenerationOutput);
            }
        }

        if (validDocs.length > 0) {
            // Pick a random one from the remaining valid docs
            const randomIndex = Math.floor(Math.random() * validDocs.length);
            const selectedDoc = validDocs[randomIndex];
            if (selectedDoc) {
                return await signGenerationOutput(selectedDoc);
            }
        }

        return null;
    } catch (error) {
        console.error("Error getting random generation:", error);
        return null;
    }
}
