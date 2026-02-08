"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useSessionContext } from "@/contexts/session.contexts";
import LoadingAnimation from "@/components/LoadingAnimation";
import CongratulationsVideo from "@/components/CongratulationsVideo";

export default function ExperimentPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [loading, setLoading] = useState(true);

    const {
        state,
        startSession,
        getNextGeneration,
        getGenerationFromId,
        clearSession,
        generation,
        language,
        sessionCount,
        sessionLimit,
    } = useSessionContext();

    useEffect(() => {
        async function fetchGeneration() {
            if (typeof id !== "string") return;

            // If context already has this generation, just stop loading.
            if (generation?.id === id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const generationOutput = await getGenerationFromId(id);
                // check if session is already started or not.
                if (generationOutput && state !== "running") {
                    startSession(
                        generationOutput.userInput.language,
                        generationOutput.userInput.age,
                    );
                }
            } catch (error) {
                console.error("Failed to fetch generation", error);
            } finally {
                setLoading(false);
            }
        }
        fetchGeneration();
    }, [id, generation?.id, getGenerationFromId, startSession, state]);

    const playAudio = useCallback(() => {
        if (generation?.final_audio_gcs_path) {
            const audio = new Audio(generation.final_audio_gcs_path);
            audio.play().catch((err) =>
                console.error("Failed to play audio:", err)
            );
        }
    }, [generation?.final_audio_gcs_path]);

    const handleNext = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        const nextGen = await getNextGeneration();

        if (!nextGen) {
            // Session over (limit reached or no more images).
            // Stop loading to allow re-render with "congratulations" state (and video overlay).
            setLoading(false);
        } else {
            router.replace(`/experiments/${nextGen.id}`);
        }
    }, [loading, getNextGeneration, router]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (loading || state === "congratulations") return;

            if (event.code === "Space") {
                event.preventDefault();
                handleNext();
            } else if (event.code === "Tab") {
                event.preventDefault();
                playAudio();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleNext, playAudio, loading, state]);

    return (
        <div className="relative h-full w-full overflow-hidden bg-black font-sans selection:bg-violet-500/30">
            {/* Background */}
            <div className="hidden md:block absolute inset-0 z-0">
                <Image
                    src="/common/background-up.webp"
                    alt="Experiment Background"
                    fill
                    className="object-cover object-left-bottom"
                    priority
                    quality={90}
                />
            </div>

            {/* Foreground */}
            <div className="absolute inset-0 z-10 overflow-hidden rounded-none border-0 shadow-none sm:inset-6 sm:rounded-[2rem] md:rounded-[2.5rem] md:border-4 md:border-white/10 md:shadow-2xl md:inset-8 pointer-events-none">
                <Image
                    src="/experiment/foreground-up.webp"
                    alt="Experiment Foreground"
                    fill
                    className="object-cover object-right"
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
                                router.push("/");
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

                    {/* Progress Indicator - Top Center */}
                    <div className="absolute left-1/2 top-8 md:top-14 -translate-x-1/2 transform pointer-events-auto">
                        <div className="rounded-full bg-black/40 px-6 py-2 backdrop-blur-md border border-white/10 shadow-lg">
                            <span className="text-lg md:text-xl font-bold text-white/90 font-mono tracking-wider">
                                {Math.min(sessionCount, sessionLimit)} / {sessionLimit}
                            </span>
                        </div>
                    </div>

                    {/* Speech Button - Top Right */}
                    <div className="pointer-events-auto transition-transform hover:scale-110 active:scale-95">
                        <button
                            onClick={playAudio}
                            className={`focus:outline-none ${!generation?.final_audio_gcs_path
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
                                        state !== "congratulations" && (
                                            <div className="flex items-center justify-center w-full h-full max-w-4xl max-h-[80vh] bg-black/50 rounded-lg border-2 border-white/20 backdrop-blur-sm pointer-events-auto">
                                                <div className="text-white/50 p-8 text-center">
                                                    <span className="text-xl">
                                                        Experiment {id}{" "}
                                                        Visualization (No Data)
                                                    </span>
                                                </div>
                                            </div>
                                        )
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

                {/* Congratulations Video Overlay */}
                {state === "congratulations" && (
                    <CongratulationsVideo
                        language={language || "en"}
                        onComplete={() => {
                            clearSession();
                            router.push("/");
                        }}
                    />
                )}
            </div>
        </div>
    );
}
