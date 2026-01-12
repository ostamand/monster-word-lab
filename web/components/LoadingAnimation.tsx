import React from "react";

interface LoadingAnimationProps {
    className?: string;
    message?: string;
}

export default function LoadingAnimation(
    { className = "", message = "Loading..." }: LoadingAnimationProps,
) {
    return (
        <div
            className={`flex flex-col items-center justify-center ${className}`}
        >
            {/* Animation Container */}
            <div className="relative flex items-center justify-center w-24 h-24 mb-4">
                {/* Core - Pulsing Circle */}
                <div className="absolute w-4 h-4 bg-teal-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(45,212,191,0.8)] z-10">
                </div>

                {/* Ring 1 - Fast Spin */}
                <div className="absolute w-12 h-12 border-2 border-transparent border-t-cyan-500/80 border-b-cyan-500/80 rounded-full animate-[spin_1s_linear_infinite]">
                </div>

                {/* Ring 2 - Slow Reverse Spin */}
                <div className="absolute w-20 h-20 border border-transparent border-l-violet-500/60 border-r-violet-500/60 rounded-full animate-[spin_3s_linear_infinite_reverse]">
                </div>

                {/* Outer Ripple Effect */}
                <div className="absolute w-full h-full rounded-full border-2 border-teal-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]">
                </div>
            </div>

            {/* Loading Text */}
            {message && (
                <span className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-cyan-200 animate-pulse tracking-widest">
                    {message}
                </span>
            )}
        </div>
    );
}
