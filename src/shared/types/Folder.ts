import type { Note } from "./Note";

export type Folder = {
    id: number;
    title: string;
    expanded: boolean;
    notes: Note[];
};
