export type NotesAction =
    | { type: "ADD" }
    | { type: "DELETE"; id: number }
    | { type: "UPDATE"; id: number; newTitle?: string; newContent?: string };
