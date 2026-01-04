import type { Note } from "./Note";

export type Folder = {
    id: number;
    title: string;
    notes: Note[];
};
