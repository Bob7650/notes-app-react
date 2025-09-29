import type { NoteElement } from "./NoteElement";

export type ItemsAction =
| { type: "ADD_ITEM"; payload: NoteElement}
| { type: "REMOVE_ITEM"; id: string};