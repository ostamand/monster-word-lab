"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PossibleLanguages } from "@/lib/generations";
import ImageButton from "./ImageButton";
import { useSessionContext } from "@/contexts/session.contexts";
import themesData from "@/lib/data/themes.json";
import targetWordsDataRaw from "@/lib/data/target_words.json";

const targetWordsData = targetWordsDataRaw as Record<string, Record<string, string[]>>;

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
    const { guidedMode } = useSessionContext();
    const [selectedLanguage, setSelectedLanguage] = useState<PossibleLanguages>(
        "en",
    );
    const [selectedAge, setSelectedAge] = useState<number>(5);
    const [theme, setTheme] = useState<string | null>(null);
    const [targetWord, setTargetWord] = useState<string | null>(null);

    const [kidThemes, setKidThemes] = useState<{id: string, image: string}[]>([]);
    const [kidTargetWords, setKidTargetWords] = useState<string[]>([]);

    // Randomize themes once on mount
    useEffect(() => {
        const randomThemes = [...themesData].sort(() => 0.5 - Math.random()).slice(0, 4);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setKidThemes(randomThemes);
    }, []);

    // Randomize target words when language or age changes
    useEffect(() => {
        const words = targetWordsData[selectedLanguage]?.[selectedAge.toString()] || [];
        const randomWords = [...words].sort(() => 0.5 - Math.random()).slice(0, 4);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setKidTargetWords(randomWords);
        // Reset selected target word if it's no longer in the random selection
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTargetWord(null);
    }, [selectedLanguage, selectedAge]);

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
            className="flex flex-col items-center gap-4 p-6 md:p-8 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl max-w-md w-full animate-fade-in-up opacity-0 pointer-events-auto max-h-[90vh] overflow-y-auto"
            style={{ animationDelay: "150ms" }}
        >
            {/* Language Selection */}
            <div className="flex flex-col items-center gap-1">
                <h2 className="text-white text-lg font-bold drop-shadow-md">
                    {t("choose_language")}
                </h2>
                <div className="flex gap-3">
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
                                width={80}
                                height={80}
                                className="w-12 md:w-16 h-auto"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Age Selection */}
            <div className="flex flex-col items-center gap-1">
                <h2 className="text-white text-lg font-bold drop-shadow-md">
                    {t("select_age")}
                </h2>
                <div className="flex gap-1.5">
                    {ages.map((age) => (
                        <button
                            key={age}
                            onClick={() => setSelectedAge(age)}
                            className={`transition-transform hover:scale-110 active:scale-95 duration-200 ${
                                selectedAge === age
                                    ? "scale-110 drop-shadow-[0_0_15px_rgba(167,139,250,0.8)]"
                                    : "opacity-80 hover:opacity-100"
                            }`}
                        >
                            <Image
                                src={`/start/btn-${age}.png`}
                                alt={`Age ${age}`}
                                width={60}
                                height={60}
                                className="w-10 md:w-14 h-auto"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Inputs or Choices */}
            {guidedMode === "parent" ? (
                (showTheme || showTargetWord) && (
                    <div className="flex flex-col items-center gap-3 w-full max-w-sm px-2">
                        {showTheme && (
                            <div className="w-full">
                                <label
                                    className="block text-white text-sm font-bold mb-0.5 drop-shadow-md"
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
                                    className="w-full px-3 py-1.5 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-violet-400 focus:bg-white/30 backdrop-blur-sm transition-all shadow-lg text-xs md:text-sm"
                                />
                            </div>
                        )}
                        {showTargetWord && (
                            <div className="w-full">
                                <label
                                    className="block text-white text-sm font-bold mb-0.5 drop-shadow-md"
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
                                    className="w-full px-3 py-1.5 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-violet-400 focus:bg-white/30 backdrop-blur-sm transition-all shadow-lg text-xs md:text-sm"
                                />
                            </div>
                        )}
                    </div>
                )
            ) : (
                (showTheme || showTargetWord) && (
                    <div className="flex flex-col items-center gap-4 w-full">
                        {/* Kid Theme Selection */}
                        {showTheme && (
                            <div className="flex flex-col items-center gap-1.5 w-full">
                                <h2 className="text-white text-md font-bold drop-shadow-md">
                                    {t("choose_theme")}
                                </h2>
                                <div className="grid grid-cols-4 gap-2">
                                    {kidThemes.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTheme(theme === t.id ? null : t.id)}
                                            className={`relative rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95 border-2 md:border-4 ${
                                                theme === t.id
                                                    ? "border-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]"
                                                    : "border-transparent opacity-80 hover:opacity-100"
                                            }`}
                                        >
                                            <Image
                                                src={t.image}
                                                alt={t.id}
                                                width={80}
                                                height={80}
                                                className="w-14 h-14 md:w-20 md:h-20 object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Kid Target Word Selection */}
                        {showTargetWord && (
                            <div className="flex flex-col items-center gap-1.5 w-full">
                                <h2 className="text-white text-md font-bold drop-shadow-md">
                                    {t("choose_word")}
                                </h2>
                                <div className="grid grid-cols-2 gap-2 w-full px-2">
                                    {kidTargetWords.map((word) => (
                                        <button
                                            key={word}
                                            onClick={() => setTargetWord(targetWord === word ? null : word)}
                                            className={`px-3 py-1.5 rounded-xl bg-white/20 border-2 text-white text-xs md:text-sm font-bold transition-all hover:scale-105 active:scale-95 backdrop-blur-sm ${
                                                targetWord === word
                                                    ? "border-violet-400 bg-white/30 shadow-[0_0_10px_rgba(167,139,250,0.8)]"
                                                    : "border-white/30 opacity-80 hover:opacity-100"
                                            }`}
                                        >
                                            {word}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
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
                        imageClassName="w-[180px] md:w-[240px] h-auto drop-shadow-xl group-hover:drop-shadow-2xl transition-all"
                    />
                </button>
            </div>
        </div>
    );
}
