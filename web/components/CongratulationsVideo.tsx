
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
                    throw new Error("Failed to fetch video list");
                }
                const data = await response.json();
                const videos = data.videos;

                if (videos && videos.length > 0) {
                    const randomVideo = videos[Math.floor(
                        Math.random() * videos.length,
                    )];
                    setVideoSrc(`/congratulations/${language}/${randomVideo}`);
                    // Trigger animation shortly after setting source
                    setTimeout(() => setIsVisible(true), 50);
                } else {
                    // If no videos, just finish immediately
                    onComplete();
                }
            } catch (error) {
                console.error("Error fetching congratulations videos:", error);
                onComplete();
            }
        }

        fetchVideos();
    }, [onComplete]);

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
