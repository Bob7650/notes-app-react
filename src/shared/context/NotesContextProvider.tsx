import { useEffect, useReducer, type ReactNode } from "react";
import { NotesContext } from "./NotesContext";
import type { NoteObject } from "../types/NoteObject";
import type { NotesAction } from "../types/NotesAction";

export default function NotesContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [notesState, dispatch] = useReducer(notesReducer, initialState());

    /**
     * Utility function that saves notes to the local storage
     */
    const updateStorage = () => {
        localStorage.setItem("notes", JSON.stringify(notesState));
    };

    useEffect(updateStorage, [notesState]);

    return (
        <NotesContext value={[notesState, dispatch]}>{children}</NotesContext>
    );
}

function initialState(): NoteObject[] {
    const savedNotes = localStorage.getItem("notes");
    try {
        return JSON.parse(savedNotes ?? "[]");
    } catch (error) {
        console.error(error);
        return [];
    }
}

function notesReducer(notes: NoteObject[], action: NotesAction): NoteObject[] {
    switch (action.type) {
        case "ADD":
            const newNote: NoteObject = {
                id: Date.now(),
                title: "Untitled",
                content: "",
                depth: 0,
            };

            return [...notes, newNote];
        case "DELETE":
            const indexToRemove = notes.findIndex(
                (note) => note.id === action.id
            );

            if (indexToRemove === -1) {
                console.error(`Note does not exist! (id: ${action.id})`);
                return notes;
            }

            const updatedNotes: NoteObject[] = notes.slice();
            updatedNotes.splice(indexToRemove, 1);
            return updatedNotes;
        case "UPDATE":
            const oldNote = notes.find((note) => note.id === action.id);

            if (!oldNote) {
                console.error(`Note does not exist! (id: ${action.id})`);
                return notes;
            }
            const updatedNote = {
                id: oldNote.id,
                title: action.newTitle ?? oldNote.title,
                content: action.newContent ?? oldNote.content,
                depth: oldNote.depth,
            };

            return notes.map((note: NoteObject) =>
                note.id === action.id ? updatedNote : note
            );
    }
}
