"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { redirect } from "next/navigation";

import { useSessionContext } from "@/contexts/session.contexts";
import { PossibleLanguages } from "@/lib/generations";

export default function StartPage() {
    const [selectedLanguage, setSelectedLanguage] = useState<PossibleLanguages>(
        "en",
    );
    const [selectedAge, setSelectedAge] = useState<number>(5);
    const [theme, setTheme] = useState<string>("");
    const [targetWord, setTargetWord] = useState<string>("");

    const { startSession } = useSessionContext();

    const languages: PossibleLanguages[] = ["en", "fr", "es"];
    const ages = [3, 4, 5, 6, 7];

    const handleGeneration = () => {
        // start new session
        // redirect to generate page which will generate a new experiment based on the session content
        startSession(selectedLanguage, selectedAge);
        redirect("/generate");
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans selection:bg-violet-500/30">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/start/background.jpeg"
                    alt="Monster Word Lab Star Background"
                    fill
                    className="object-cover object-left-bottom"
                    priority
                    quality={90}
                />
            </div>

            {/* Foreground */}
            <div className="absolute inset-4 z-10 overflow-hidden rounded-[2.5rem] border-4 border-white/10 shadow-2xl sm:inset-6 md:inset-8">
                <Image
                    src="/start/foreground.jpeg"
                    alt="Monster Word Lab Start Foreground"
                    fill
                    className="object-cover object-left-bottom"
                    priority
                    quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
            </div>

            {/* Content */}
            <main className="relative z-30 flex min-h-screen flex-col items-center justify-start pb-8 pt-12 sm:pb-12 sm:pt-20 md:pb-16 md:pt-32 pointer-events-none gap-8">
                {/* Title Link */}
                <div
                    className="animate-fade-in-down opacity-0 pointer-events-auto"
                    style={{ animationDelay: "0ms" }}
                >
                    <Link href="/">
                        <Image
                            src="/landing/title.png"
                            alt="Monster Word Lab"
                            width={800}
                            height={400}
                            className="w-[300px] md:w-[500px] lg:w-[650px] h-auto drop-shadow-2xl transition-transform hover-wobble-custom cursor-pointer"
                            priority
                        />
                    </Link>
                </div>

                {/* Panel for Content */}
                <div
                    className="flex flex-col items-center gap-8 p-8 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl max-w-4xl w-full mx-4 animate-fade-in-up opacity-0 pointer-events-auto"
                    style={{ animationDelay: "150ms" }}
                >
                    {/* Language Selection */}
                    <div className="flex flex-col items-center gap-4">
                        <h2 className="text-white text-2xl font-bold drop-shadow-md">
                            Choose Language
                        </h2>
                        <div className="flex gap-4">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setSelectedLanguage(lang)}
                                    className={`transition-transform hover:scale-110 active:scale-95 duration-200 ${
                                        selectedLanguage === lang
                                            ? "scale-110 drop-shadow-[0_0_15px_rgba(167,139,250,0.8)]"
                                            : "opacity-80 hover:opacity-100"
                                    }`}
                                >
                                    <Image
                                        src={`/start/${lang}.png`}
                                        alt={lang}
                                        width={100}
                                        height={100}
                                        className="w-20 md:w-24 h-auto"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Age Selection */}
                    <div className="flex flex-col items-center gap-4">
                        <h2 className="text-white text-2xl font-bold drop-shadow-md">
                            Select Age
                        </h2>
                        <div className="flex gap-4">
                            {ages.map((age) => (
                                <button
                                    key={age}
                                    onClick={() => setSelectedAge(age)}
                                    className={`transition-transform hover:scale-110 active:scale-95 duration-200 ${
                                        selectedAge === age
                                            ? "scale-115 drop-shadow-[0_0_15px_rgba(167,139,250,0.8)]"
                                            : "opacity-80 hover:opacity-100"
                                    }`}
                                >
                                    <Image
                                        src={`/start/btn-${age}.png`}
                                        alt={`Age ${age}`}
                                        width={80}
                                        height={80}
                                        className="w-16 md:w-20 h-auto"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="flex flex-col items-center gap-4 w-full max-w-md px-4">
                        <div className="w-full">
                            <label
                                className="block text-white text-lg font-bold mb-2 drop-shadow-md"
                                htmlFor="theme"
                            >
                                Theme (Optional)
                            </label>
                            <input
                                id="theme"
                                type="text"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                placeholder="e.g. Space, Dinosaurs"
                                className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-violet-400 focus:bg-white/30 backdrop-blur-sm transition-all shadow-lg"
                            />
                        </div>
                        <div className="w-full">
                            <label
                                className="block text-white text-lg font-bold mb-2 drop-shadow-md"
                                htmlFor="targetWord"
                            >
                                Target Word (Optional)
                            </label>
                            <input
                                id="targetWord"
                                type="text"
                                value={targetWord}
                                onChange={(e) => setTargetWord(e.target.value)}
                                placeholder="e.g. Gravity"
                                className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-violet-400 focus:bg-white/30 backdrop-blur-sm transition-all shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Start Button */}
                    <div className="mt-4">
                        <button className="group relative transition-transform hover:scale-105 active:scale-95 hover-wobble-custom">
                            <Image
                                src="/start/start-btn.png"
                                alt="Start Experiment"
                                width={400}
                                height={133}
                                className="w-[280px] md:w-[360px] h-auto drop-shadow-xl group-hover:drop-shadow-2xl transition-all"
                                onClick={handleGeneration}
                            />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
