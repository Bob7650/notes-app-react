import { useContext, useRef, useState, type MouseEvent } from "react";
import "./Selector.style.css";
import useOutsideClick from "../../../../shared/hooks/useOutsideClick";
import type { Note } from "../../../../shared/types/Note";
import { NotesContext } from "../../../../shared/context/NotesContext/NotesContext";

interface Props {
    data: Omit<Note, "content">;
    onMouseDown?: (
        e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
    ) => void;
    isSelected?: boolean;
}

export default function Selector({ data, onMouseDown, isSelected }: Props) {
    const { notesActions, renamingNoteId } = useContext(NotesContext)!!;

    const [inputValue, setInputValue] = useState<string>(data.title);

    const noteSelectorRef = useRef<HTMLInputElement>(null);

    const confirmRename = () => {
        notesActions.rename(data.id, inputValue);
        cancelRename();
    };

    const cancelRename = () => {
        notesActions.setRenaming(null);
    };

    useOutsideClick(
        () => {
            if (data.id === renamingNoteId) confirmRename();
        },
        noteSelectorRef,
        [confirmRename, renamingNoteId, data.id]
    );

    return (
        <>
            <div
                ref={noteSelectorRef}
                className={`selector-wrapper${
                    isSelected ? " selector-selected" : ""
                }`}
                onContextMenu={(e) => e.preventDefault()}
                onMouseDown={(e) => {
                    onMouseDown?.(e);
                }}
            >
                {renamingNoteId === data.id ? (
                    <input
                        className="editable-input"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                confirmRename();
                            }
                        }}
                        autoFocus
                    />
                ) : (
                    <span
                        className="editable-label"
                        onDoubleClick={() => notesActions.setRenaming(data.id)}
                    >
                        {data.title}
                    </span>
                )}
            </div>
        </>
    );
}
