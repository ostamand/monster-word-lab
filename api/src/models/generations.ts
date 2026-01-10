import { db } from "./database.js";

import configs from "../configs.js";

import { Timestamp } from "firebase-admin/firestore";

type PossibleLanguages = "en" | "es" | "fr";

export type GenerationInput = {
    gender: string | null;
    age: string | null;
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
