"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useSessionContext } from "@/contexts/session.contexts";

export default function ErrorPage() {
    const { clearSession } = useSessionContext();

    const handleGoHome = () => {
        clearSession();
        redirect("/");
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black font-sans">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/common/background-up.webp"
                    alt="Background"
                    fill
                    className="object-cover object-left-bottom"
                    priority
                    quality={90}
                />
            </div>

            {/* Foreground Overlay - similar to StartPage but simpler */}
            <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
                <div className="flex flex-col items-center gap-6 p-10 rounded-[2rem] bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl max-w-lg w-full animate-fade-in-up">
                    {
                        /* Icon or Image could go here, maybe a sad monster?
                        For now, just text.
                    */
                    }

                    <h1 className="text-5xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                        Oops!
                    </h1>

                    <p className="text-xl text-white/90 font-medium leading-relaxed">
                        Something went wrong while creating your experiment.
                    </p>

                    <p className="text-white/60 text-sm">
                        Please try again later.
                    </p>

                    <button
                        onClick={handleGoHome}
                        className="mt-4 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(139,92,246,0.5)] border border-white/20"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}
