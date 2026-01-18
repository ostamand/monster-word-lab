"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

interface ImageButtonProps {
    src: string;
    alt: string;
    textKey?: string;
    className?: string;
    imageClassName?: string;
    width?: number;
    height?: number;
}

export default function ImageButton({
    src,
    alt,
    textKey,
    className = "",
    imageClassName = "",
    width = 400,
    height = 133,
}: ImageButtonProps) {
    const { t } = useTranslation();

    return (
        <div className={`relative ${className}`}>
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={imageClassName}
            />
            {textKey && (
                <div className="absolute inset-0 flex items-center justify-end pr-[8%]">
                    <span
                        className="w-[65%] text-center text-white font-fredoka font-bold text-lg md:text-2xl lg:text-3xl leading-tight drop-shadow-lg"
                        style={{
                            textShadow:
                                "2px 2px 0px #3b4d8a, -2px -2px 0px #3b4d8a, 2px -2px 0px #3b4d8a, -2px 2px 0px #3b4d8a, 0px 4px 6px rgba(0,0,0,0.4)",
                        }}
                    >
                        {t(textKey)}
                    </span>
                </div>
            )}
        </div>
    );
}
