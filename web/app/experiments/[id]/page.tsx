"use client";

import Image from "next/image";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useSessionContext } from "@/contexts/session.contexts";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function ExperimentPage() {
    const params = useParams();
    const { id } = params;

    const [loading, setLoading] = useState(true);

    const {
        state,
        startSession,
        getNextGeneration,
        getGenerationFromId,
        clearSession,
        generation,
    } = useSessionContext();

    useEffect(() => {
        async function fetchGeneration() {
            setLoading(true);
            try {
                if (typeof id === "string") {
                    const generationOutput = await getGenerationFromId(id);
                    // check if session is already started or not.
                    if (generationOutput && state !== "running") {
                        startSession(
                            generationOutput.userInput.language,
                            generationOutput.userInput.age,
                        );
                    }
                }
            } catch (error) {
                console.error("Failed to fetch generation", error);
            } finally {
                setLoading(false);
            }
        }
        fetchGeneration();
    }, [id]);

    function playAudio() {
        if (generation?.final_audio_gcs_path) {
            const audio = new Audio(generation.final_audio_gcs_path);
            audio.play().catch((err) =>
                console.error("Failed to play audio:", err)
            );
        }
    }

    async function handleNext() {
        setLoading(true);
        await getNextGeneration();
        if (state !== "running") {
            // should redirect to done, for now clear session and redirect to home.
            redirect("/");
        }
        setLoading(false);
    }

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black font-sans selection:bg-violet-500/30">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/start/background.jpeg"
                    alt="Experiment Background"
                    fill
                    className="object-cover object-left-bottom"
                    priority
                    quality={90}
                />
            </div>

            {/* Foreground */}
            <div className="absolute inset-4 z-10 overflow-hidden rounded-[2.5rem] border-4 border-white/10 shadow-2xl sm:inset-6 md:inset-8 pointer-events-none">
                <Image
                    src="/experiment/foreground.jpeg"
                    alt="Experiment Foreground"
                    fill
                    className="object-cover object-left-bottom"
                    priority
                    quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
            </div>

            {/* Main Layout (z-20) */}
            <div className="relative z-20 h-full w-full pointer-events-none">
                {/* Header: Home & Speech Buttons */}
                <header className="absolute top-0 left-0 right-0 flex items-start justify-between p-8 md:p-14 z-40">
                    {/* Home Button - Top Left */}
                    <div className="pointer-events-auto transition-transform hover:scale-105 active:scale-95">
                        <a
                            onClick={() => {
                                clearSession();
                                redirect("/");
                            }}
                            className="cursor-pointer"
                        >
                            <Image
                                src="/experiment/home.png"
                                alt="Home"
                                width={200}
                                height={70}
                                className="h-14 w-auto md:h-18 drop-shadow-lg"
                            />
                        </a>
                    </div>

                    {/* Speech Button - Top Right */}
                    <div className="pointer-events-auto transition-transform hover:scale-110 active:scale-95">
                        <button
                            onClick={playAudio}
                            className={`focus:outline-none ${
                                !generation?.final_audio_gcs_path
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                            disabled={!generation?.final_audio_gcs_path}
                        >
                            <Image
                                src="/experiment/speech.png"
                                alt="Speak"
                                width={80}
                                height={80}
                                className="w-14 h-14 md:w-18 md:h-18 drop-shadow-lg"
                            />
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="absolute inset-0 flex items-center justify-center p-4 md:p-8 pointer-events-none z-30">
                    {loading
                        ? (
                            <LoadingAnimation
                                message="Loading Experiment..."
                                className="pointer-events-auto"
                            />
                        )
                        : (
                            <>
                                {generation?.final_image_gcs_path
                                    ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={generation
                                                .final_image_gcs_path}
                                            alt={generation.userInput
                                                .targetWord ||
                                                "Experiment Generation"}
                                            className="w-auto h-auto max-w-[90%] max-h-[75%] md:max-h-[85%] object-contain rounded-3xl border-4 border-sky-400 shadow-[0_0_60px_rgba(56,189,248,0.8)] bg-black/50 pointer-events-auto transition-all duration-500"
                                        />
                                    )
                                    : (
                                        <div className="flex items-center justify-center w-full h-full max-w-4xl max-h-[80vh] bg-black/50 rounded-lg border-2 border-white/20 backdrop-blur-sm pointer-events-auto">
                                            <div className="text-white/50 p-8 text-center">
                                                <span className="text-xl">
                                                    Experiment {id}{" "}
                                                    Visualization (No Data)
                                                </span>
                                            </div>
                                        </div>
                                    )}
                            </>
                        )}
                </main>

                {/* Footer: Next Button */}
                <footer className="absolute bottom-0 left-0 right-0 flex items-end justify-end p-8 md:p-14 z-40">
                    {/* Next Button - Bottom Right */}
                    <div className="pointer-events-auto transition-transform hover:scale-105 active:scale-95">
                        <button onClick={handleNext}>
                            <Image
                                src="/experiment/next.png"
                                alt="Next Experiment"
                                width={200}
                                height={70}
                                className="h-14 w-auto md:h-20 drop-shadow-lg"
                            />
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}
