"use client";

import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

import { useSessionContext } from "@/contexts/session.contexts";
import { getRandomGeneration, PossibleLanguages } from "@/lib/generations";
import SelectionPanel from "@/components/SelectionPanel";
import LoadingAnimation from "@/components/LoadingAnimation";
import Modal from "@/components/Modal";

export default function ExplorePage() {
    const { startSession, clearSession } = useSessionContext();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleExplore = async (
        language: PossibleLanguages,
        age: number,
        theme: string | null,
        targetWord: string | null,
    ) => {
        setIsLoading(true);
        setShowError(false);
        // start new session with selected options
        startSession(language, age, theme, targetWord);

        // fetch a random generation directly
        const randomGen = await getRandomGeneration(language, age, []);

        if (randomGen) {
            router.push(`/experiments/${randomGen.id}`);
        } else {
            console.error("Failed to fetch random generation");
            setIsLoading(false);
            setShowError(true);
        }
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black font-sans selection:bg-violet-500/30">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/explore/background.jpeg"
                    alt="Monster Word Lab Explore Background"
                    fill
                    className="object-cover object-left-bottom"
                    priority
                    quality={90}
                />
            </div>

            {/* Foreground */}
            <div className="absolute inset-4 z-10 overflow-hidden rounded-[2.5rem] border-4 border-white/10 shadow-2xl sm:inset-6 md:inset-8 pointer-events-none">
                <Image
                    src="/explore/foreground.jpeg"
                    alt="Monster Word Lab Explore Foreground"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
            </div>

            {/* Main Layout (z-20) */}
            <div className="relative z-20 h-full w-full pointer-events-none">
                {/* Header: Home Button */}
                <header className="absolute top-0 left-0 right-0 flex items-start justify-start p-8 md:p-14 z-40">
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
                </header>

                {/* Content: Panel on the Left */}
                <main className="absolute inset-0 flex items-center justify-start w-full p-8 md:p-14 pointer-events-none z-30">
                    <SelectionPanel
                        onStart={handleExplore}
                        buttonImageSrc="/explore/rnd.png"
                        buttonAltText="Random"
                        showTheme={false}
                        showTargetWord={false}
                    />
                </main>
            </div>
            
            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <LoadingAnimation message="Finding a discovery..." />
                </div>
            )}

            {/* Error Overlay */}
            <Modal isOpen={showError}>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">No Discoveries Found</h2>
                <p className="text-slate-300 mb-8 text-lg">
                    We couldn&apos;t find any existing experiments for this language and age group.
                </p>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => router.push("/start")}
                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                    >
                        Create New Experiment
                    </button>
                    <button
                        onClick={() => setShowError(false)}
                        className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20"
                    >
                        Try Different Settings
                    </button>
                </div>
            </Modal>
        </div>
    );
}
