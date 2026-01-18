"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: "en", src: "/landing/select-language/english-select.webp", alt: "English" },
        { code: "es", src: "/landing/select-language/spanish-select.webp", alt: "Español" },
        { code: "fr", src: "/landing/select-language/french-select.webp", alt: "Français" },
    ];

    const toggleOpen = () => setIsOpen(!isOpen);

    const changeLanguage = (langCode: string) => {
        i18n.changeLanguage(langCode);
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
        <div className="relative z-50" ref={dropdownRef}>
            {/* Main Selector Button */}
            <button
                onClick={toggleOpen}
                className="relative transition-transform hover:scale-105 active:scale-95 focus:outline-none"
            >
                <Image
                    src="/landing/select-language/select.webp"
                    alt="Language"
                    width={200}
                    height={60}
                    className="w-[110px] md:w-[180px] h-auto drop-shadow-lg"
                />
            </button>

            {/* Dropdown Options */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 flex flex-col gap-2 animate-fade-in-down origin-top-right">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`relative transition-transform hover:scale-105 active:scale-95 focus:outline-none ${
                                i18n.language === lang.code ? "brightness-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" : "brightness-90 hover:brightness-100"
                            }`}
                        >
                            <Image
                                src={lang.src}
                                alt={lang.alt}
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
