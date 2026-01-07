import { createContext } from "react";
import type { Note } from "../../types/Note";
import type { DrawerAction } from "../../hooks/useDrawer";
import type { Folder } from "../../types/Folder";

export type DrawerContextValue = {
    notes: Note[];
    folders: Folder[];
    drawerActions: DrawerAction;
    lastRemoved: number | null;
    renamingNoteId: number | null;
};

export const DrawerContext = createContext<DrawerContextValue | null>(null);
