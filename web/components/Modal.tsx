import React from "react";

interface ModalProps {
    isOpen: boolean;
    children: React.ReactNode;
}

export default function Modal({ isOpen, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="relative bg-slate-900 border-4 border-sky-400 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_60px_rgba(56,189,248,0.8)] pointer-events-auto transition-all duration-500">
                {children}
            </div>
        </div>
    );
}
