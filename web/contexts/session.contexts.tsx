"use client";

import { createContext, ReactNode, useContext, useState } from "react";

import { GenerationOutput, PossibleLanguages } from "@/lib/generations";
import { getGenerationById, getRandomGeneration } from "@/lib/generations";

type SessionState = "waiting" | "running" | "done" | "congratulations";

type SessionContextType = {
    state: SessionState;
    generation: GenerationOutput | null;
    language: PossibleLanguages | null;
    age: number | null;
    theme: string | null;
    targetWord: string | null;
    startSession: (
        language: PossibleLanguages,
        age: number | null,
        theme?: string | null,
        targetWord?: string | null,
    ) => void;
    getNextGeneration: (
        successful?: boolean,
    ) => Promise<GenerationOutput | null>;
    getGenerationFromId: (id: string) => Promise<GenerationOutput | null>;
    clearSession: () => void;
    sessionCount: number;
    sessionLimit: number;
};

type SessionHistory = {
    generation: GenerationOutput;
    successful: boolean | undefined;
};

const MAX_SESSION_IMAGES = 10;

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<SessionState>("waiting");
    const [generation, setGeneration] = useState<GenerationOutput | null>(null);
    const [history, setHistory] = useState<SessionHistory[]>([]);
    const [language, setLanguage] = useState<PossibleLanguages | null>(null);
    const [age, setAge] = useState<number | null>(null);
    const [theme, setTheme] = useState<string | null>(null);
    const [targetWord, setTargetWord] = useState<string | null>(null);

    const clearSession = () => {
        setState("waiting");
        setHistory([]);
        setAge(null);
        setLanguage(null);
        setTheme(null);
        setTargetWord(null);
    };

    const getNextGeneration = async (successful?: boolean) => {
        if (state !== "running") return null;

        // successful = was the last generation succesful or not?

        let updatedHistory = history;

        if (generation) {
            if (!history.find((h) => h.generation.id === generation.id)) {
                updatedHistory = [...history, { generation, successful }];
                setHistory(updatedHistory);
            }
        }

        // Check if we hit the limit
        if (updatedHistory.length >= MAX_SESSION_IMAGES) {
            console.log("Session limit reached");
            setState("congratulations");
            setGeneration(null);
            return null;
        }

        const completedIds = updatedHistory.map((h) => h.generation.id);

        const nextGeneration = await getRandomGeneration(
            language || "en", // will always be defined anyway
            null, // for now skip age
            completedIds,
        );

        if (!nextGeneration) {
            console.log("No more generations available");
            // we are effectively done with this batch, show congratulations
            setState("congratulations");
            setGeneration(null);
            return null;
        }

        console.log("Next generation:", nextGeneration);

        setGeneration(nextGeneration);

        return nextGeneration;
    };

    const getGenerationFromId = async (id: string) => {
        const generationOutput = await getGenerationById(id);
        setGeneration(generationOutput);
        return generationOutput;
    };

    const startSession = (
        language: PossibleLanguages,
        age: number | null,
        theme?: string | null,
        targetWord?: string | null,
    ) => {
        setState("running");
        setHistory([]);
        setLanguage(language);
        setAge(age);
        if (theme !== undefined) {
            setTheme(theme);
        }
        if (targetWord !== undefined) {
            setTargetWord(targetWord);
        }
    };

    const values = {
        state,
        generation,
        language,
        age,
        theme,
        targetWord,
        startSession,
        getNextGeneration,
        getGenerationFromId,
        clearSession,
        sessionCount: history.length + 1,
        sessionLimit: MAX_SESSION_IMAGES,
    };

    return (
        <SessionContext.Provider value={values}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSessionContext() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error(
            "useSessionContext must be called within SessionContext.Provider",
        );
    }
    return context;
}
