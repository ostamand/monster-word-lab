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

type GenerationResponse = {
    id: string;
    final_image_gcs_path: string | undefined;
    final_audio_gcs_path: string | undefined;
};

export async function sendGeneration(
    data: GenerationInput,
): Promise<GenerationResponse | null> {
    try {
        const response = await fetch(`${configs.apiEndpoint}/generations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Log the error status if the server responds with an error
            const errorText = await response.text();
            console.error(
                `Generation request failed: ${response.status} - ${errorText}`,
            );
            return null;
        }

        const result = await response.json() as GenerationResponse;

        return result;
    } catch (error) {
        console.error("Error while trying to send generation request:", error);
        return null;
    }
}

export async function getRandomGeneration(
    language: PossibleLanguages,
    age?: number | null,
    excludeIds?: string[],
): Promise<GenerationOutput | null> {
    try {
        const url = `${configs.apiEndpoint}/generations/random`;
        const body = {
            language,
            age: age ?? undefined, 
            excludeIds: excludeIds || [],
        };
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
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
