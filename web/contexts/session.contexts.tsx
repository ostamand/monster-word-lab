"use client";

import { createContext, ReactNode, useContext, useState } from "react";

import { GenerationOutput, PossibleLanguages } from "@/lib/generations";
import { getRandomGeneration, getGenerationById } from "@/lib/generations";

type SessionState = "waiting" | "running" | "done";

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
    getNextGeneration: (successful?: boolean) => Promise<GenerationOutput | null>;
    getGenerationFromId: (id: string) => Promise<GenerationOutput | null>;
    clearSession: () => void;
};

type SessionHistory = {generation: GenerationOutput; successful: boolean | undefined}

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
        if(state !== "running") return null;

        // successful = was the last generation succesful or not?
        if(generation) {
            setHistory([...history, {generation, successful}]);
        }

        const completedIds = history.map((h) => h.generation.id);

        const nextGeneration = await getRandomGeneration(
            language || "en", // will always be defined anyway
            null, // for now skip age
            completedIds,
        );

        if (!nextGeneration) {
            // we are done
            setState("done");
            setGeneration(null);
            return null;
        }

        setGeneration(nextGeneration);

        return generation;
    };

    const getGenerationFromId = async (id: string) => {
        const generationOutput = await getGenerationById(id);
        setGeneration(generationOutput)
        return generationOutput;
    }

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
