import { createContext, ReactNode, useContext, useState } from "react";

import { GenerationOutput, PossibleLanguages } from "@/lib/generations";
import { getRandomGeneration } from "@/lib/generations";

type SessionState = "waiting" | "running" | "done";

type SessionContextType = {
    state: SessionState;
    generation: GenerationOutput | null;
    completedIds: string[];
    language: PossibleLanguages | null;
    age: number | null;
    startSession: (language: PossibleLanguages, age: number | null) => void;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<SessionState>("waiting");
    const [generation, setGeneration] = useState<GenerationOutput | null>(null);
    const [completedIds, setCompletedIds] = useState<string[]>([]);
    const [language, setLanguage] = useState<PossibleLanguages | null>(null);
    const [age, setAge] = useState<number | null>(null);

    const getNextGeneration = async () => {
        const generation = await getRandomGeneration(
            language || "en", // will always be defined anyway
            age,
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

    const startSession = (language: PossibleLanguages, age: number | null) => {
        setState("running");
        setCompletedIds([]);
        setLanguage(language);
        setAge(age);
        getNextGeneration();
    };

    const values = {
        state,
        generation,
        completedIds,
        language,
        age,
        startSession,
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
