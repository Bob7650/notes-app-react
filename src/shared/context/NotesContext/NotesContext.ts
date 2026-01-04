import { createContext } from "react";
import type { Note } from "../../types/Note";
import type { NotesAction } from "../../hooks/useNotes";

export type NotesContextValue = {
    notes: Note[];
    notesActions: NotesAction;
    lastRemoved: number | null;
    renamingNoteId: number | null;
};

export const NotesContext = createContext<NotesContextValue | null>(null);
