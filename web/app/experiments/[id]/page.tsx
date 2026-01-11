"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ExperimentPage() {
    const params = useParams();
    const id = Number(params.id);
    const nextId = id + 1;

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans selection:bg-violet-500/30">
            {/* Background Layer (z-0) */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/experiment/background.jpeg"
                    alt="Experiment Background"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
            </div>

            {/* Foreground Layer (z-10) */}
            {/* Framed overlay similar to landing page but using experiment assets */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <Image
                    src="/experiment/foreground.jpeg"
                    alt="Experiment Foreground"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                />
            </div>

            {/* Main Content Area (z-20) */}
            <main className="relative z-20 flex min-h-screen flex-col items-center justify-center p-4">
                {/* Central Image Placeholder */}
                <div className="relative w-full max-w-[1184px] aspect-[1184/864] bg-black/50 rounded-lg border-2 border-white/20 shadow-2xl overflow-hidden backdrop-blur-sm group">
                    <div className="absolute inset-0 flex items-center justify-center text-white/50">
                        <span className="text-xl">Experiment {id} Visualization</span>
                    </div>
                    {/* In the future, the GCS image will go here */}

                    {/* Speech Button - Positioned inside the frame, bottom right */}
                    <div className="absolute bottom-4 right-4 pointer-events-auto transition-transform hover:scale-110 active:scale-95 z-30">
                        <button
                            onClick={() => console.log("Speech clicked")}
                            className="focus:outline-none"
                        >
                            <Image
                                src="/experiment/speech.png"
                                alt="Speak"
                                width={80}
                                height={80}
                                className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg"
                            />
                        </button>
                    </div>
                </div>
            </main>

            {/* UI Controls (z-30) */}
            <div className="absolute inset-0 z-30 pointer-events-none">
                {/* Buttons Container */}

                {/* Home Button - Top Left */}
                {/* Image is ~824x282 ~ 2.92 aspect ratio */}
                <div className="absolute top-6 left-6 pointer-events-auto transition-transform hover:scale-105 active:scale-95">
                    <Link href="/">
                        <Image
                            src="/experiment/home.png"
                            alt="Home"
                            width={200}
                            height={70}
                            className="h-16 w-auto md:h-20 drop-shadow-lg"
                        />
                    </Link>
                </div>

                {/* Next Button - Bottom Right */}
                {/* Image is ~862x298 ~ 2.89 aspect ratio */}
                <div className="absolute bottom-6 right-6 pointer-events-auto transition-transform hover:scale-105 active:scale-95">
                    <Link href={`/experiments/${nextId}`}>
                        <Image
                            src="/experiment/next.png"
                            alt="Next Experiment"
                            width={200}
                            height={70}
                            className="h-16 w-auto md:h-24 drop-shadow-lg"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}
