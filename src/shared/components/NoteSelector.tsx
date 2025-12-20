import { useRef, useState, type MouseEvent } from "react";
import "./NoteSelector.style.css";
import useOutsideClick from "../hooks/useOutsideClick";
import type { NoteObject } from "../types/NoteObject";

interface Props {
    data: NoteObject;
    onRename: (id: number, newName: string) => void;
    onMouseDown?: (
        e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
    ) => void;
    isSelected?: boolean;
}

export default function NoteSelector({
    data,
    onRename,
    onMouseDown,
    isSelected,
}: Props) {
    const [inputValue, setInputValue] = useState<string>(data.title);
    const [isRenaming, setRenaming] = useState(false);

    const noteSelectorRef = useRef<HTMLInputElement>(null);

    const confirmRename = () => {
        console.log(`Renaming to ${inputValue}`);
        onRename(data.id, inputValue);
        cancelRename();
    };

    const cancelRename = () => {
        setRenaming(false);
    };

    const startRename = () => {
        setRenaming(true);
    };

    useOutsideClick(
        () => {
            if (isRenaming) confirmRename();
        },
        noteSelectorRef,
        [isRenaming, confirmRename]
    );

    return (
        <div
            className={`note-selector-wrapper${
                isSelected ? " note-selected" : ""
            }`}
            ref={noteSelectorRef}
            onContextMenu={(e) => e.preventDefault()}
            tabIndex={0}
            onMouseDown={(e) => {
                onMouseDown?.(e);
            }}
        >
            {[...Array(data.depth)].map(() => (
                <span className="indent-bar">|</span>
            ))}
            {isRenaming ? (
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
                <span className="editable-label" onDoubleClick={startRename}>
                    {data.title}
                </span>
            )}
        </div>
    );
}
