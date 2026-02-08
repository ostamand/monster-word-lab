"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSessionContext } from "@/contexts/session.contexts";

export default function GuidedModeSelector() {
    const { guidedMode, setGuidedMode } = useSessionContext();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const modes = [
        { code: "parent", src: "/landing/select-mode/parent-select.webp", alt: "Parent Mode" },
        { code: "kid", src: "/landing/select-mode/kid-select.webp", alt: "Kid Mode" },
    ];

    const toggleOpen = () => setIsOpen(!isOpen);

    const changeMode = (mode: "parent" | "kid") => {
        setGuidedMode(mode);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={`relative ${isOpen ? "z-[60]" : "z-50"}`} ref={dropdownRef}>
            {/* Main Selector Button */}
            <button
                onClick={toggleOpen}
                className="relative transition-transform hover:scale-105 active:scale-95 focus:outline-none"
            >
                <Image
                    src="/landing/select-mode/select.webp"
                    alt="Mode Selection"
                    width={200}
                    height={60}
                    className="w-[110px] md:w-[180px] h-auto drop-shadow-lg"
                />
            </button>

            {/* Dropdown Options */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 flex flex-col gap-2 animate-fade-in-down origin-top-right">
                    {modes.map((mode) => (
                        <button
                            key={mode.code}
                            onClick={() => changeMode(mode.code as "parent" | "kid")}
                            className={`relative transition-transform hover:scale-105 active:scale-95 focus:outline-none ${
                                guidedMode === mode.code ? "brightness-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" : "brightness-90 hover:brightness-100"
                            }`}
                        >
                            <Image
                                src={mode.src}
                                alt={mode.alt}
                                width={200}
                                height={60}
                                className="w-[110px] md:w-[180px] h-auto drop-shadow-md"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
