import { useEffect, useState } from "react";
import type { NoteObject } from "../types/NoteObject";

export function useNotes() {
    const initialState = (): NoteObject[] => {
        const savedNotes = localStorage.getItem("notes");
        try {
            return JSON.parse(savedNotes ?? "[]");
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const [notes, setNotes] = useState<NoteObject[]>(initialState);

    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

    const notesActions = {
        add: (): void => {
            setNotes((prevState) => [
                ...prevState,
                {
                    id: Date.now(),
                    title: "Untitled",
                    content: "",
                    depth: 0,
                },
            ]);
        },
        remove: (id: number) => {
            setNotes((prevState) =>
                prevState.filter((notes) => notes.id !== id)
            );
        },
        rename: (id: number, title: string): void => {
            setNotes((prevState) =>
                prevState.map((note) =>
                    note.id === id ? { ...note, title: title } : note
                )
            );
        },
        updateContent: (id: number, content: string): void => {
            setNotes((prevState) =>
                prevState.map((note) =>
                    note.id === id ? { ...note, content: content } : note
                )
            );
        },
    };

    return { notes, notesActions };
}
