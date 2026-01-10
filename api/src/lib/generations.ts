import { randomUUID } from "node:crypto";
import { GoogleAuth } from "google-auth-library";

import configs from "../configs.js";
import { type GenerationInput } from "../models/generations.js";

const auth = new GoogleAuth();

type RunPayload = {
    app_name: string;
    user_id: string;
    session_id: string;
    new_message: {
        role: string;
        parts: { text: string }[];
    };
    streaming: boolean;
};

export async function sendGeneration(request: GenerationInput) {
    try {
        const client = await auth.getIdTokenClient(configs.generationEndpoint);

        const sessionId = randomUUID();

        const sessionUrl =
            `${configs.generationEndpoint}/apps/${configs.agentAppName}/users/${configs.generationUserId}/sessions/${sessionId}`;

        const sessionResponse = await client.request({
            url: sessionUrl,
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        if (!sessionResponse.ok) {
            throw new Error(
                `Error creating session: ${sessionResponse.statusText}`,
            );
        }

        console.log("Session:", sessionResponse.data);

        const payload: RunPayload = {
            app_name: configs.agentAppName,
            user_id: configs.generationUserId,
            session_id: sessionId,
            new_message: {
                role: "user",
                parts: [{ text: JSON.stringify(request) }],
            },
            streaming: false,
        };

        const runResponse = await client.request({
            url: `${configs.generationEndpoint}/run`,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data: payload,
        });

        if (!runResponse.ok) {
            throw new Error(`Error running agent: ${runResponse.statusText}`);
        }

        const data = runResponse.data;

        // get final answer

        const builderData = Array.isArray(data) ? data[data.length - 1] : data;

        const answer = JSON.parse(builderData.content.parts[0].text) as {
            id: string;
            final_image_gcs_path: string;
            final_audio_gcs_path: string;
        };

        console.log("Assets generated successfully:", data);

        return answer;
    } catch (error) {
        console.error(
            "An error occurred while trying to call generation:",
            error,
        );
        return null;
    }
}
