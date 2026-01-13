"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import { useSessionContext } from "@/contexts/session.contexts";
import { GenerationInput, sendGeneration } from "@/lib/generations";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function GeneratePage() {
    const [loading, setLoading] = useState(true);

    const {
        state,
        language,
        theme,
        targetWord,
        age,
        setComplete,
    } = useSessionContext();

    if (state === "waiting" || !language) redirect("/");

    useEffect(() => {
        const data: GenerationInput = {
            age,
            language,
            theme,
            targetWord,
        };

        async function doGeneration() {
            const generationResponse = await sendGeneration(data);

            // TODO remove
            setTimeout(() => {
                if (generationResponse) {
                    setComplete(generationResponse.id);
                    redirect(`/experiments/${generationResponse.id}`);
                }
            }, 5000);
        }

        doGeneration();
    }, []);

    if (loading) {
        return (
            <LoadingAnimation
                message="Generating New Experiment..."
                className="pointer-events-auto"
            />
        );
    }

    return (
        <>
            Generate
        </>
    );
}
