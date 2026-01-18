interface Window {
    umami: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        track: (event_name: string, event_data?: Record<string, any>) => void;
    };
}
