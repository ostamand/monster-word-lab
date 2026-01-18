
import { NextResponse } from "next/server";

import configs from "../../../configs";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") || "en";

    try {
        const response = await fetch(
            `${configs.apiEndpoint}/congratulations/random?language=${language}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (!response.ok) {
            // Forward the error status if possible, or 500
            return NextResponse.json(
                { message: "Failed to fetch from backend" },
                { status: response.status || 500 },
            );
        }

        const data = await response.json();
        // Backend returns { url: "signed_url" }
        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to proxy congratulations video request:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}
