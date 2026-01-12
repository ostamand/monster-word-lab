"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    GenerationOutput,
    getGenerationById,
    getRandomGeneration,
} from "@/lib/generations";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function ExperimentPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [generation, setGeneration] = useState<GenerationOutput | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGeneration() {
            setLoading(true);
            try {
                if (typeof id === "string") {
                    const gen = await getGenerationById(id);
                    setGeneration(gen);
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
        if (!generation) return;
        try {
            const nextGen = await getRandomGeneration(
                generation.userInput.language,
                generation.userInput.age,
                [generation.id]
            );
            if (nextGen) {
                router.push(`/experiments/${nextGen.id}`);
            }
        } catch (error) {
            console.error("Failed to get next generation", error);
        }
    }

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black font-sans selection:bg-violet-500/30">
            {/* Background Layer (z-0) */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/experiment/background.jpeg"
                    alt="Experiment Background"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
            </div>

            {/* Foreground Layer (z-10) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <Image
                    src="/experiment/foreground.jpeg"
                    alt="Experiment Foreground"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                />
            </div>

            {/* Main Layout (z-20) */}
            <div className="relative z-20 flex h-full flex-col justify-between p-4 md:p-6">
                
                {/* Header: Home & Speech */}
                <header className="flex w-full items-start justify-between pointer-events-none shrink-0 z-40">
                    {/* Home Button - Top Left */}
                    <div className="pointer-events-auto transition-transform hover:scale-105 active:scale-95">
                        <Link href="/">
                            <Image
                                src="/experiment/home.png"
                                alt="Home"
                                width={200}
                                height={70}
                                className="h-16 w-auto md:h-20 drop-shadow-lg"
                            />
                        </Link>
                    </div>

                    {/* Speech Button - Top Right */}
                    <div className="pointer-events-auto transition-transform hover:scale-110 active:scale-95">
                        <button
                            onClick={playAudio}
                            className={`focus:outline-none ${!generation?.final_audio_gcs_path ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!generation?.final_audio_gcs_path}
                        >
                            <Image
                                src="/experiment/speech.png"
                                alt="Speak"
                                width={80}
                                height={80}
                                className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg"
                            />
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex flex-1 items-center justify-center min-h-0 w-full p-4 pointer-events-none z-30">
                    {loading
                        ? <LoadingAnimation message="Loading Experiment..." className="pointer-events-auto" />
                        : (
                            <>
                                {generation?.final_image_gcs_path
                                    ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={generation.final_image_gcs_path}
                                            alt={generation.userInput.targetWord ||
                                                "Experiment Generation"}
                                            className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg border-2 border-white/20 shadow-2xl bg-black/50 pointer-events-auto"
                                        />
                                    )
                                    : (
                                        <div className="flex items-center justify-center w-full h-full max-w-2xl max-h-[500px] bg-black/50 rounded-lg border-2 border-white/20 backdrop-blur-sm pointer-events-auto">
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
                <footer className="flex w-full items-end justify-end pointer-events-none shrink-0 z-40">
                    {/* Next Button - Bottom Right */}
                    <div className="pointer-events-auto transition-transform hover:scale-105 active:scale-95">
                        <button onClick={handleNext}>
                            <Image
                                src="/experiment/next.png"
                                alt="Next Experiment"
                                width={200}
                                height={70}
                                className="h-16 w-auto md:h-24 drop-shadow-lg"
                            />
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}