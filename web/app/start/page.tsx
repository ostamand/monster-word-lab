"use client";

import Image from "next/image";
import { redirect } from "next/navigation";

import { useSessionContext } from "@/contexts/session.contexts";
import { PossibleLanguages } from "@/lib/generations";
import SelectionPanel from "@/components/SelectionPanel";

export default function StartPage() {
    const { startSession, clearSession } = useSessionContext();

    const handleGeneration = (
        language: PossibleLanguages,
        age: number,
        theme: string | null,
        targetWord: string | null,
    ) => {
        // start new session
        // redirect to generate page which will generate a new experiment based on the session content
        startSession(language, age, theme, targetWord);
        redirect("/generate");
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black font-sans selection:bg-violet-500/30">
            {/* Background */}
            <div className="hidden md:block absolute inset-0 z-0">
                <Image
                    src="/common/background.jpeg"
                    alt="Monster Word Lab Star Background"
                    fill
                    className="object-cover object-left-bottom"
                    priority
                    quality={90}
                />
            </div>

            {/* Foreground */}
            <div className="absolute inset-0 z-10 overflow-hidden rounded-none border-0 shadow-none sm:inset-6 sm:rounded-[2rem] md:rounded-[2.5rem] md:border-4 md:border-white/10 md:shadow-2xl md:inset-8 pointer-events-none">
                <Image
                    src="/start/foreground.jpeg"
                    alt="Monster Word Lab Start Foreground"
                    fill
                    className="object-cover object-left"
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

                {/* Content: Panel on the Right */}
                <main className="absolute inset-0 flex items-center justify-end w-full p-8 md:p-14 pointer-events-none z-30">
                    <SelectionPanel
                        onStart={handleGeneration}
                        buttonImageSrc="/start/start-btn.png"
                        showTheme={true}
                        showTargetWord={true}
                    />
                </main>
            </div>
        </div>
    );
}
