
import { readdir } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") || "en";

    // Validate language to prevent directory traversal or invalid paths
    const safeLanguage = ["en", "es", "fr"].includes(language) ? language : "en";

    try {
        const congratulationsDir = join(
            process.cwd(),
            "public",
            "congratulations",
            safeLanguage,
        );
        const files = await readdir(congratulationsDir);
        const videos = files.filter((file) => file.endsWith(".mp4"));
        return NextResponse.json({ videos });
    } catch (error) {
        console.error("Failed to list congratulations videos:", error);
        return NextResponse.json({ videos: [] }, { status: 500 });
    }
}
