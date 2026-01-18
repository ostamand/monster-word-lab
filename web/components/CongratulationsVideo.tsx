
import React, { useEffect, useState } from "react";

interface CongratulationsVideoProps {
    onComplete: () => void;
    language: string;
}

export default function CongratulationsVideo(
    { onComplete, language }: CongratulationsVideoProps,
) {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        async function fetchVideos() {
            try {
                const response = await fetch(
                    `/api/congratulations?language=${language}`,
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch video");
                }
                const data = await response.json();

                if (data.url) {
                    setVideoSrc(data.url);
                    // Trigger animation shortly after setting source
                    setTimeout(() => setIsVisible(true), 50);
                } else {
                    // If no URL returned, finish
                    onComplete();
                }
            } catch (error) {
                console.error("Error fetching congratulations video:", error);
                onComplete();
            }
        }

        fetchVideos();
    }, [onComplete, language]);

    if (!videoSrc) {
        return null; // Or a loading spinner
    }

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-700 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <video
                src={videoSrc}
                autoPlay
                className={`max-h-screen max-w-full transition-transform duration-700 ease-out ${isVisible ? "scale-100" : "scale-75"}`}
                onEnded={onComplete}
                controls={false}
            />
        </div>
    );
}
