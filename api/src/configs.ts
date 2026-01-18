import dotenv from "dotenv";

dotenv.config();

const configs = {
    generationCollection: "learning_generations",
    dailyGenerationsQuota: parseInt(process.env.DAILY_GENERATIONS_QUOTA || "5"),
    generationEndpoint: process.env.GENERATION_ENDPOINT || "",
    agentAppName: process.env.GENERATION_AGENT_APP_NAME || "",
    generationUserId: "api",
    mockGeneration: process.env.MOCK_GENERATION || false,
    assetsBucketName: process.env.ASSETS_BUCKET_NAME ||
        "monster-word-lab-assets",
};

console.log("Configs:", configs);

export default configs;
