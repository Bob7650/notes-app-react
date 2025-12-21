import { createContext, type ActionDispatch } from "react";
import type { NoteObject } from "../types/NoteObject";
import type { NotesAction } from "../types/NotesAction";

export const NotesContext = createContext<
    [NoteObject[], ActionDispatch<[action: NotesAction]>]
>([[], () => {}]);
