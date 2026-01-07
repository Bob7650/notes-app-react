import {
    useEffect,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import type { Note } from "../types/Note";
import type { Folder } from "../types/Folder";

const createDrawerActions = (
    setNotes: Dispatch<SetStateAction<Note[]>>,
    setFolders: Dispatch<SetStateAction<Folder[]>>,
    setLastRemoved: Dispatch<SetStateAction<number | null>>,
    setRenamingId: Dispatch<SetStateAction<number | null>>
) => ({
    addNote: (): void => {
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
    updateNoteContent: (id: number, content: string): void => {
        setNotes((prevState) =>
            prevState.map((note) =>
                note.id === id ? { ...note, content: content } : note
            )
        );
    },
    addFolder: (): void => {
        setFolders((prevState) => [
            ...prevState,
            {
                id: Date.now(),
                title: "Untitled",
                expanded: false,
                notes: [
                    {
                        id: 1234,
                        title: "Untitled",
                        content: "",
                        isRenaming: false,
                    },
                ],
            },
        ]);
    },
    addFolderChild: (id: number, notes: Note[]): void => {
        setFolders((prevState) =>
            prevState.map((folder) =>
                folder.id === id
                    ? { ...folder, notes: [...folder.notes, ...notes] }
                    : folder
            )
        );
    },
    setFolderChildren: (id: number, notes: Note[]): void => {
        setFolders((prevState) =>
            prevState.map((folder) =>
                folder.id === id ? { ...folder, notes: notes } : folder
            )
        );
    },
    setFolderExpanded: (id: number, expanded: boolean): void => {
        setFolders((prevState) =>
            prevState.map((folder) =>
                folder.id === id ? { ...folder, expanded: expanded } : folder
            )
        );
    },
    removeEntry: (id: number | null) => {
        setNotes((prevState) => prevState.filter((note) => note.id !== id));
        setFolders((prevState) =>
            prevState.filter((folder) => folder.id !== id)
        );
        // Instead of this can send event, maybe chackout in the future
        setLastRemoved(id);
    },
    setEntryRenaming: (id: number | null) => {
        setRenamingId(id);
    },
    renameEntry: (id: number, title: string): void => {
        setNotes((prevState) =>
            prevState.map((note) =>
                note.id === id ? { ...note, title: title } : note
            )
        );
        setFolders((prevState) =>
            prevState.map((folder) =>
                folder.id === id ? { ...folder, title: title } : folder
            )
        );
    },
});

export type DrawerAction = ReturnType<typeof createDrawerActions>;

export function useDrawer() {
    const initialNotesState = (): Note[] => {
        const savedNotes = localStorage.getItem("notes");
        try {
            return JSON.parse(savedNotes ?? "[]");
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const initialFolderState = (): Folder[] => {
        const savedFolders = localStorage.getItem("folders");
        try {
            return JSON.parse(savedFolders ?? "[]");
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const [notes, setNotes] = useState<Note[]>(initialNotesState);
    const [folders, setFolders] = useState<Folder[]>(initialFolderState);
    const [lastRemoved, setLastRemoved] = useState<number | null>(null);
    const [renamingNoteId, setRenamingNoteId] = useState<number | null>(null);
    const drawerActions = useMemo(
        () =>
            createDrawerActions(
                setNotes,
                setFolders,
                setLastRemoved,
                setRenamingNoteId
            ),
        []
    );

    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

    useEffect(() => {
        localStorage.setItem("folders", JSON.stringify(folders));
    }, [folders]);

    return { notes, folders, drawerActions, lastRemoved, renamingNoteId };
}
