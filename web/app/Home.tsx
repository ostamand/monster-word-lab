import Image from "next/image";
import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";
import ImageButton from "@/components/ImageButton";

export default function Home() {
    return (
        <div className="relative h-full w-full overflow-hidden bg-black font-sans selection:bg-violet-500/30">
            {/* Language Selector */}
            <div className="absolute top-4 right-4 z-50 md:top-14 md:right-14">
                <LanguageSelector />
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
                        className="w-[350px] md:w-[600px] lg:w-[800px] h-auto drop-shadow-2xl transition-transform hover-wobble-custom cursor-pointer"
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
        </div>
    );
}
