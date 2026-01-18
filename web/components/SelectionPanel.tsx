"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PossibleLanguages } from "@/lib/generations";
import ImageButton from "./ImageButton";

interface SelectionPanelProps {
    onStart: (
        language: PossibleLanguages,
        age: number,
        theme: string | null,
        targetWord: string | null,
    ) => void;
    showTheme?: boolean;
    showTargetWord?: boolean;
    buttonImageSrc: string;
    buttonAltText?: string;
    buttonTextKey?: string;
}

export default function SelectionPanel({
    onStart,
    showTheme = true,
    showTargetWord = true,
    buttonImageSrc,
    buttonAltText = "Start",
    buttonTextKey,
}: SelectionPanelProps) {
    const { t, i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState<PossibleLanguages>(
        "en",
    );
    const [selectedAge, setSelectedAge] = useState<number>(5);
    const [theme, setTheme] = useState<string | null>(null);
    const [targetWord, setTargetWord] = useState<string | null>(null);

    useEffect(() => {
        const currentLang = i18n.language?.split("-")[0] as PossibleLanguages;
        if (["en", "fr", "es"].includes(currentLang)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedLanguage((prev) => (prev !== currentLang ? currentLang : prev));
        }
    }, [i18n.language]);

    const languages: PossibleLanguages[] = ["en", "fr", "es"];
    const ages = [3, 4, 5, 6, 7];

    return (
        <div
            className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl max-w-md w-full animate-fade-in-up opacity-0 pointer-events-auto max-h-full overflow-y-auto"
            style={{ animationDelay: "150ms" }}
        >
            {/* Language Selection */}
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-white text-xl font-bold drop-shadow-md">
                    {t("choose_language")}
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
                                className="w-16 md:w-20 h-auto"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Age Selection */}
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-white text-xl font-bold drop-shadow-md">
                    {t("select_age")}
                </h2>
                <div className="flex gap-2">
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
                                className="w-12 md:w-16 h-auto"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Inputs */}
            {(showTheme || showTargetWord) && (
                <div className="flex flex-col items-center gap-3 w-full max-w-sm px-2">
                    {showTheme && (
                        <div className="w-full">
                            <label
                                className="block text-white text-md font-bold mb-1 drop-shadow-md"
                                htmlFor="theme"
                            >
                                {t("theme_optional")}
                            </label>
                            <input
                                id="theme"
                                type="text"
                                value={theme || ""}
                                onChange={(e) => setTheme(e.target.value)}
                                placeholder={t("theme_placeholder")}
                                className="w-full px-4 py-2 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-violet-400 focus:bg-white/30 backdrop-blur-sm transition-all shadow-lg text-sm"
                            />
                        </div>
                    )}
                    {showTargetWord && (
                        <div className="w-full">
                            <label
                                className="block text-white text-md font-bold mb-1 drop-shadow-md"
                                htmlFor="targetWord"
                            >
                                {t("target_word_optional")}
                            </label>
                            <input
                                id="targetWord"
                                type="text"
                                value={targetWord || ""}
                                onChange={(e) => setTargetWord(e.target.value)}
                                placeholder={t("target_word_placeholder")}
                                className="w-full px-4 py-2 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-violet-400 focus:bg-white/30 backdrop-blur-sm transition-all shadow-lg text-sm"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Start Button */}
            <div className="mt-2">
                <button
                    className="group relative transition-transform hover:scale-105 active:scale-95 hover-wobble-custom"
                    onClick={() =>
                        onStart(
                            selectedLanguage,
                            selectedAge,
                            theme,
                            targetWord,
                        )}
                >
                    <ImageButton
                        src={buttonImageSrc}
                        alt={buttonAltText}
                        textKey={buttonTextKey}
                        imageClassName="w-[200px] md:w-[260px] h-auto drop-shadow-xl group-hover:drop-shadow-2xl transition-all"
                    />
                </button>
            </div>
        </div>
    );
}
