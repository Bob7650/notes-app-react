import {
    useEffect,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import type { Note } from "../types/Note";

const createNotesActions = (
    setNotes: Dispatch<SetStateAction<Note[]>>,
    setLastRemoved: Dispatch<SetStateAction<number | null>>,
    setRenamingNoteId: Dispatch<SetStateAction<number | null>>
) => ({
    add: (): void => {
        setNotes((prevState) => [
            ...prevState,
            {
                id: Date.now(),
                title: "Untitled",
                content: "",
                isRenaming: false,
            },
        ]);
    },
    remove: (id: number | null) => {
        setNotes((prevState) => prevState.filter((notes) => notes.id !== id));
        // Instead of this can send event, maybe chackout in the future
        setLastRemoved(id);
    },
    setRenaming: (id: number | null) => {
        setRenamingNoteId(id);
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
});

export type NotesAction = ReturnType<typeof createNotesActions>;

export function useNotes() {
    const initialState = (): Note[] => {
        const savedNotes = localStorage.getItem("notes");
        try {
            return JSON.parse(savedNotes ?? "[]");
        } catch (error) {
            console.error(error);
            return [];
        }
    };
    const [notes, setNotes] = useState<Note[]>(initialState);
    const [lastRemoved, setLastRemoved] = useState<number | null>(null);
    const [renamingNoteId, setRenamingNoteId] = useState<number | null>(null);
    const notesActions = useMemo(
        () => createNotesActions(setNotes, setLastRemoved, setRenamingNoteId),
        []
    );

    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

    return { notes, notesActions, lastRemoved, renamingNoteId };
}
