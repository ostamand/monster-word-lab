type AvailableLanguages = "fr" | "en" | "es";

type PossibleGender = "m" | "f" // male, female

type PedagogicalArchitectInput = {
    gender: PossibleGender | undefined // optional gender
    age: number | undefined; // optional age
    language: AvailableLanguages; // supports french (fr), english (en) and spanish (es)
    theme: string | undefined; // optional theme for the visual learning aid to be generated
    targetWord: string | undefined; // optional targetWord that needs to be included in the visual learning aid
};

type PedagogicalArchitectOutput = {
    userInput: PedagogicalArchitectInput;
    pedagogicalOutput: {
        sentence: string
        learningGoal: string // metadata that defines "Why are we teaching this?"
    }
}
