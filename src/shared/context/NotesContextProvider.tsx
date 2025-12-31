import { type ReactNode } from "react";
import { NotesContext } from "./NotesContext";
import { useNotes } from "../hooks/useNotes";

export default function NotesContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const notesState = useNotes();

    return (
        <NotesContext.Provider value={notesState}>
            {children}
        </NotesContext.Provider>
    );
}
