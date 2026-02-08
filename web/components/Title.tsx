"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";

interface TitleProps {
    className?: string;
    priority?: boolean;
}

export default function Title({ className, priority = false }: TitleProps) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const HOVER_DURATION = 1500; // 1.5 seconds

    const handleMouseEnter = () => {
        timerRef.current = setTimeout(() => {
            const end = Date.now() + 3 * 1000; // 3 seconds of confetti

            // Brighter, more saturated versions of the original colors
            const colors = ["#C084FC", "#22D3EE", "#6366F1", "#F472B6", "#FB7185", "#38BDF8"];

            const frame = () => {
                confetti({
                    particleCount: 6,
                    angle: 60,
                    spread: 70,
                    origin: { x: 0, y: 0.6 },
                    colors: colors,
                    ticks: 300,
                    gravity: 0.8,
                    drift: 1,
                    scalar: 1.2,
                });
                confetti({
                    particleCount: 6,
                    angle: 120,
                    spread: 70,
                    origin: { x: 1, y: 0.6 },
                    colors: colors,
                    ticks: 300,
                    gravity: 0.8,
                    drift: -1,
                    scalar: 1.2,
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }, HOVER_DURATION);
    };

    const handleMouseLeave = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`cursor-pointer inline-block ${className}`}
        >
            <Image
                src="/common/title-v2.webp"
                alt="Monster Word Lab"
                width={1412}
                height={209}
                className="w-full h-auto drop-shadow-2xl transition-transform hover-wobble-custom"
                priority={priority}
            />
        </div>
    );
}
