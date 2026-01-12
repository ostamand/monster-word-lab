import { Timestamp } from "firebase-admin/firestore";

import configs from "@/configs";

export type PossibleLanguages = "en" | "es" | "fr";

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

export async function getRandomGeneration(
    language: PossibleLanguages,
    age?: number | null,
    excludeIds?: string[],
): Promise<GenerationOutput | null> {
    try {
        let url =
            `${configs.apiEndpoint}/generations/random?language=${language}`;
        if (age) {
            url += `&age=${age}`;
        }
        if (excludeIds) {
            let excludedString = excludeIds.reduce((agg, value) => {
                return agg + `,${value}`;
            }, "");
            excludedString = excludedString.slice(1);
            url += `&excludeIds=${excludedString}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            return null;
        }
        const data = await response.json() as GenerationOutput;
        return data;
    } catch (error) {
        console.error("Error while trying to get random generation:", error);
        return null;
    }
}

export async function getDailyGenerationsCount() {
    try {
        const response = await fetch(
            `${configs.apiEndpoint}/generations/count/today`,
        );
        if (!response.ok) {
            return null;
        }
        const data = await response.json() as { count: number };
        return data.count;
    } catch (error) {
        console.error(
            "Error while trying to get current daily generations count:",
            error,
        );
        return null;
    }
}

export async function getGenerationById(
    id: string,
): Promise<GenerationOutput | null> {
    try {
        const response = await fetch(
            `${configs.apiEndpoint}/generations/${id}`,
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json() as GenerationOutput;
        return data;
    } catch (error) {
        console.error(
            `Error while trying to get generation by ID (${id}):`,
            error,
        );
        return null;
    }
}
