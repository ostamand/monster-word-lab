"use client";

import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useSessionContext } from "@/contexts/session.contexts";
import { getRandomGeneration, PossibleLanguages } from "@/lib/generations";
import SelectionPanel from "@/components/SelectionPanel";
import LoadingAnimation from "@/components/LoadingAnimation";
import Modal from "@/components/Modal";

export default function ExplorePage() {
    const { t } = useTranslation();
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
        <div className="relative h-full w-full overflow-hidden bg-black font-sans selection:bg-violet-500/30">
            {/* Background */}
            <div className="hidden md:block absolute inset-0 z-0">
                <Image
                    src="/common/background-up.webp"
                    alt="Monster Word Lab Explore Background"
                    fill
                    className="object-cover object-left-bottom"
                    priority
                    quality={90}
                />
            </div>

            {/* Foreground */}
            <div className="absolute inset-0 z-10 overflow-hidden rounded-none border-0 shadow-none sm:inset-6 sm:rounded-[2rem] md:rounded-[2.5rem] md:border-4 md:border-white/10 md:shadow-2xl md:inset-8 pointer-events-none">
                <Image
                    src="/explore/foreground-up.webp"
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
                        buttonImageSrc="/explore/rnd-shape.png"
                        buttonAltText="Random"
                        buttonTextKey="random_button"
                        showTheme={false}
                        showTargetWord={false}
                    />
                </main>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <LoadingAnimation message={t("loading_discovery")} />
                </div>
            )}

            {/* Error Overlay */}
            <Modal isOpen={showError}>
                <h2 className="text-2xl font-bold text-sky-400 mb-4">
                    {t("no_discoveries_title")}
                </h2>
                <p className="text-white mb-6">
                    {t("no_discoveries_message")}
                </p>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => router.push("/start")}
                        className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-full transition-colors pointer-events-auto shadow-lg"
                    >
                        {t("create_new_experiment")}
                    </button>
                    <button
                        onClick={() => setShowError(false)}
                        className="border-2 border-sky-500 text-sky-400 hover:bg-sky-500/10 font-bold py-2 px-4 rounded-full transition-colors pointer-events-auto"
                    >
                        {t("try_different_settings")}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
