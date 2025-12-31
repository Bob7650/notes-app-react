import { createContext } from "react";
import type { NoteObject } from "../types/NoteObject";

export const NotesContext = createContext<{
    notes: NoteObject[];
    notesActions: {
        add: () => void;
        remove: (id: number) => void;
        rename: (id: number, title: string) => void;
        updateContent: (id: number, content: string) => void;
    };
}>({
    notes: [],
    notesActions: {
        add: (): void => {},
        remove: (id: number): void => {},
        rename: (id: number, title: string): void => {},
        updateContent: (id: number, content: string): void => {},
    },
});
