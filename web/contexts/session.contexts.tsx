"use client";

import { createContext, ReactNode, useContext, useState } from "react";

import { GenerationOutput, PossibleLanguages } from "@/lib/generations";
import { getRandomGeneration } from "@/lib/generations";

type SessionState = "waiting" | "running" | "done";

type SessionContextType = {
    state: SessionState;
    generation: GenerationOutput | null;
    completedIds: string[];
    setComplete: (id: string) => void;
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
    getNextGeneration: () => Promise<GenerationOutput | null>;
    clearSession: () => void;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<SessionState>("waiting");
    const [generation, setGeneration] = useState<GenerationOutput | null>(null);
    const [completedIds, setCompletedIds] = useState<string[]>([]);
    const [language, setLanguage] = useState<PossibleLanguages | null>(null);
    const [age, setAge] = useState<number | null>(null);
    const [theme, setTheme] = useState<string | null>(null);
    const [targetWord, setTargetWord] = useState<string | null>(null);

    const clearSession = () => {
        setState("waiting");
        setCompletedIds([]);
        setAge(null);
        setLanguage(null);
        setTheme(null);
        setTargetWord(null);
    };

    const getNextGeneration = async () => {
        const generation = await getRandomGeneration(
            language || "en", // will always be defined anyway
            null, // for now skip age
            completedIds,
        );

        if (!generation) {
            // we are done
            setState("done");
            setGeneration(null);
            return null;
        }

        setGeneration(generation);
        setCompletedIds([...completedIds, generation.id]);

        return generation;
    };

    const startSession = (
        language: PossibleLanguages,
        age: number | null,
        theme?: string | null,
        targetWord?: string | null,
    ) => {
        setState("running");
        setCompletedIds([]);
        setLanguage(language);
        setAge(age);
        if (theme !== undefined) {
            setTheme(theme);
        }
        if (targetWord !== undefined) {
            setTheme(targetWord);
        }
    };

    const setComplete = (id: string) => {
        if (!completedIds.includes(id)) {
            setCompletedIds([...completedIds, id]);
        }
    };

    const values = {
        state,
        generation,
        completedIds,
        setComplete,
        language,
        age,
        theme,
        targetWord,
        startSession,
        getNextGeneration,
        clearSession,
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
