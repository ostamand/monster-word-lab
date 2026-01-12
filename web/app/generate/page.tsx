"use client";

import { redirect } from "next/navigation";

import { useSessionContext } from "@/contexts/session.contexts";

export default function GeneratePage() {
    const { state } = useSessionContext();
    console.log(state);
    if (state === "waiting") redirect("/");
    return (
        <>
            Generate
        </>
    );
}
