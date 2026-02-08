import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";
import GuidedModeSelector from "@/components/GuidedModeSelector";
import ImageButton from "@/components/ImageButton";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";

export default function Home() {
    const { t } = useTranslation();
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    return (
        <div className="relative h-full w-full overflow-hidden bg-black font-sans selection:bg-violet-500/30">
            {/* Top-left Info Button */}
            <div className="absolute top-4 left-4 z-50 md:top-14 md:left-14">
                <button
                    onClick={() => setIsAboutOpen(true)}
                    className="relative transition-transform hover:scale-110 active:scale-95 focus:outline-none group"
                >
                    <Image
                        src="/landing/info.webp"
                        alt={t("info_button_alt")}
                        width={100}
                        height={100}
                        className="w-[50px] md:w-[70px] h-auto drop-shadow-lg group-hover:drop-shadow-sky-400/50 transition-all"
                    />
                </button>
            </div>

            {/* Selectors */}
            <div className="absolute top-4 right-4 z-50 md:top-14 md:right-14 flex flex-col gap-4 items-end">
                <LanguageSelector />
                <GuidedModeSelector />
            </div>

            <div className="hidden md:block absolute inset-0 z-0">
                <Image
                    src="/common/background-up.webp"
                    alt="Monster Word Lab Background Texture"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
            </div>

            <div className="absolute inset-0 z-10 overflow-hidden rounded-none border-0 shadow-none sm:inset-6 sm:rounded-[2rem] md:rounded-[2.5rem] md:border-4 md:border-white/10 md:shadow-2xl md:inset-8">
                <Image
                    src="/landing/foreground-up.webp"
                    alt="Monster Lab Scene"
                    fill
                    className="object-cover object-bottom"
                    priority
                    quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
            </div>

            <main className="relative z-30 flex h-full flex-col items-center justify-between pb-8 pt-20 sm:pb-12 sm:pt-10 md:pb-16 md:pt-16 pointer-events-none">
                <div
                    className="animate-fade-in-down opacity-0 pointer-events-auto"
                    style={{ animationDelay: "0ms" }}
                >
                    <Image
                        src="/common/title-v2.webp"
                        alt="Monster Word Lab"
                        width={1412}
                        height={209}
                        className="w-[350px] md:w-[600px] lg:w-[800px] h-auto drop-shadow-2xl transition-transform hover-wobble-custom animate-initial-wobble cursor-pointer"
                        priority
                    />
                </div>

                <div
                    className="flex flex-col gap-6 sm:flex-row sm:gap-16 animate-fade-in-up opacity-0 pointer-events-auto"
                    style={{ animationDelay: "300ms" }}
                >
                    <Link
                        href="/explore"
                        className="group relative transition-transform hover:scale-105 active:scale-95"
                    >
                        <ImageButton
                            src="/landing/btn-explore-shape.webp"
                            alt="Explore Experiments"
                            textKey="explore_experiments"
                            imageClassName="w-[220px] md:w-[280px] lg:w-[320px] h-auto drop-shadow-xl group-hover:drop-shadow-2xl transition-all"
                        />
                    </Link>

                    <Link
                        href="/start"
                        className="group relative transition-transform hover:scale-105 active:scale-95"
                    >
                        <ImageButton
                            src="/landing/btn-start-shape.webp"
                            alt="Start Experiment"
                            textKey="start_experiment"
                            imageClassName="w-[220px] md:w-[280px] lg:w-[320px] h-auto drop-shadow-xl group-hover:drop-shadow-2xl transition-all"
                        />
                    </Link>
                </div>
            </main>

            {/* About Modal */}
            <Modal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)}>
                <div className="text-white font-fredoka space-y-3">
                    <h2 className="text-2xl md:text-3xl font-bold text-sky-400 drop-shadow-lg">
                        {t("about_title")}
                    </h2>
                    
                    <p className="text-sm md:text-base leading-snug text-slate-200">
                        {t("about_description")}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                        <section className="bg-white/5 p-3 rounded-xl border border-white/10">
                            <h3 className="text-sky-300 font-bold text-lg mb-0.5 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
                                {t("about_languages_title")}
                            </h3>
                            <p className="text-slate-300 text-xs leading-tight">
                                {t("about_languages_desc")}
                            </p>
                        </section>

                        <section className="bg-white/5 p-3 rounded-xl border border-white/10">
                            <h3 className="text-sky-300 font-bold text-lg mb-0.5 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
                                {t("about_age_title")}
                            </h3>
                            <p className="text-slate-300 text-xs leading-tight">
                                {t("about_age_desc")}
                            </p>
                        </section>

                        <section className="bg-white/5 p-4 rounded-xl border border-sky-500/30 md:col-span-2 shadow-[inset_0_0_20px_rgba(56,189,248,0.1)]">
                            <h3 className="text-sky-300 font-bold text-xl mb-1 flex items-center gap-2">
                                {t("about_process_title")}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="space-y-0.5">
                                    <h4 className="text-white font-bold text-[10px] uppercase text-sky-400/80 tracking-wider">{t("about_process_sentence_name")}</h4>
                                    <p className="text-slate-400 text-[11px] leading-tight">{t("about_process_sentence_desc")}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-white font-bold text-[10px] uppercase text-sky-400/80 tracking-wider">{t("about_process_art_name")}</h4>
                                    <p className="text-slate-400 text-[11px] leading-tight">{t("about_process_art_desc")}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-white font-bold text-[10px] uppercase text-sky-400/80 tracking-wider">{t("about_process_speech_name")}</h4>
                                    <p className="text-slate-400 text-[11px] leading-tight">{t("about_process_speech_desc")}</p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white/5 p-3 rounded-xl border border-white/10 md:col-span-2">
                            <h3 className="text-sky-300 font-bold text-lg mb-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
                                {t("about_modes_title")}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <h4 className="text-white font-semibold text-[10px] uppercase tracking-wider">{t("about_parent_mode_name")}</h4>
                                    <p className="text-slate-400 text-[11px] leading-tight">{t("about_parent_mode_desc")}</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold text-[10px] uppercase tracking-wider">{t("about_kid_mode_name")}</h4>
                                    <p className="text-slate-400 text-[11px] leading-tight">{t("about_kid_mode_desc")}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <button
                        onClick={() => setIsAboutOpen(false)}
                        className="mt-2 px-6 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg text-sm"
                    >
                        {t("close")}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
