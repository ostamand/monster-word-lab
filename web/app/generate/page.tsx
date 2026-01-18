"use client";

import { redirect, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { useSessionContext } from "@/contexts/session.contexts";
import { GenerationInput, sendGeneration } from "@/lib/generations";
import Modal from "@/components/Modal";

export default function GeneratePage() {
    const { t } = useTranslation();
    const loadingMessagesRaw = t("loading_messages", { returnObjects: true });
    const loadingMessages = Array.isArray(loadingMessagesRaw) ? loadingMessagesRaw as string[] : [
        "Mixing slimy ingredients...",
        "Calibrating the monster-meter...",
        "Feeding the word-bugs...",
        "Polishing the laboratory flasks...",
        "Consulting the ancient scrolls...",
        "Waking up the hamsters...",
        "Untangling the plot lines...",
    ];

    const router = useRouter();
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);
    const hasStartedGeneration = useRef(false);

    const {
        state,
        language,
        theme,
        targetWord,
        age,
    } = useSessionContext();

    if (state === "waiting" || !language) redirect("/");

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [loadingMessages.length]);

    useEffect(() => {
        if (hasStartedGeneration.current) return;
        hasStartedGeneration.current = true;

        const data: GenerationInput = {
            age,
            language,
            theme,
            targetWord,
        };

        async function doGeneration() {
            try {
                console.log("Starting generation", data);

                if (window.umami) {
                    window.umami.track("generate", data);
                }

                const generationResponse = await sendGeneration(data);
                if (generationResponse.success) {
                    const { data: generationData } = generationResponse;
                    router.replace(`/experiments/${generationData.id}`);
                } else {
                    if (generationResponse.status === 429) {
                        console.error(
                            "Maximum number of generation per day reached.",
                        );
                        setIsLimitModalOpen(true);
                    } else {
                        router.replace("/error");
                    }
                }
            } catch (error) {
                console.error(error);
                router.replace("/error");
            }
        }

        if (process.env.NEXT_PUBLIC_DO_GENERATION === "TRUE") {
            doGeneration();
        }
    }, []);

    return (
        <div className="relative h-full w-full overflow-hidden bg-black font-sans selection:bg-violet-500/30">
            <Modal isOpen={isLimitModalOpen}>
                <h2 className="text-2xl font-bold text-sky-400 mb-4">
                    Daily Limit Reached
                </h2>
                <p className="text-white mb-6">
                    We&apos;ve reached our daily generation limit! The lab needs
                    to recharge. Please come back tomorrow.
                </p>
                <div className="flex justify-center">
                    <Link
                        href="/explore"
                        className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-full transition-colors pointer-events-auto"
                    >
                        Explore Experiments
                    </Link>
                </div>
            </Modal>
            {/* Background Layer */}
            <div className="hidden md:block absolute inset-0 z-0">
                <Image
                    src="/common/background-up.webp"
                    alt="Monster Lab Background"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
            </div>

            {/* Foreground Layer */}
            <div className="absolute inset-0 z-10 overflow-hidden rounded-none border-0 shadow-none sm:inset-6 sm:rounded-[2rem] md:rounded-[2.5rem] md:border-4 md:border-white/10 md:shadow-2xl md:inset-8">
                <Image
                    src="/generate/foreground-up.webp"
                    alt="Monster Lab Scene"
                    fill
                    className="object-cover object-right"
                    priority
                    quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
            </div>

            {/* Content Layer */}
            <main className="relative z-30 flex h-full flex-col items-center pb-8 pt-6 sm:pb-12 sm:pt-10 md:pb-16 md:pt-16 pointer-events-none">
                {/* Title */}
                <div className="animate-fade-in-down pointer-events-auto">
                    <Image
                        src="/common/title-v2.webp"
                        alt="Monster Word Lab"
                        width={1412}
                        height={209}
                        className="w-[350px] md:w-[600px] lg:w-[800px] h-auto drop-shadow-2xl transition-transform hover-wobble-custom"
                        priority
                    />
                </div>

                {/* Left-aligned Content Container */}
                <div className="flex flex-grow w-full items-center justify-start pl-4 sm:pl-12 md:pl-24">
                    <div className="flex flex-col items-center">
                        {/* Loading Container */}
                        <div className="relative animate-bounce-slow">
                            <Image
                                src="/generate/loading.png"
                                alt="Loading..."
                                width={600}
                                height={200}
                                className="w-[300px] sm:w-[450px] md:w-[600px] h-auto drop-shadow-2xl"
                                priority
                            />

                            {/* Text Overlay - Positioned relative to the loading image */}
                            <div className="absolute inset-0 flex items-center justify-center pt-16 sm:pt-24 md:pt-32">
                                <p className="w-[80%] text-center text-sm sm:text-lg md:text-xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] animate-pulse">
                                    {loadingMessages[messageIndex]}
                                </p>
                            </div>
                        </div>

                        {/* Cancel Button */}
                        <div className="mt-8 pointer-events-auto transition-transform hover:scale-105 active:scale-95">
                            <Link href="/">
                                <Image
                                    src="/generate/cancel.png"
                                    alt="Cancel Generation"
                                    width={400}
                                    height={120}
                                    className="w-[200px] sm:w-[280px] md:w-[350px] h-auto drop-shadow-xl hover:drop-shadow-2xl transition-all"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
