import { useRef, useState } from "react";
import "./NoteSelector.style.css";
import useOutsideClick from "../hooks/useOutsideClick";
import type { NoteObject } from "../types/NoteObject";

interface Props {
    data: NoteObject;
    onRename: (id: number, newName: string) => void;
    onClick?: () => void;
    isSelected?: boolean;
}

export default function NoteSelector({
    data,
    onRename,
    onClick,
    isSelected,
}: Props) {
    const [inputValue, setInputValue] = useState<string>(data.title);

    const editableInputRef = useRef<HTMLInputElement>(null);
    const editableSpanRef = useRef<HTMLSpanElement>(null);

    const confirmRename = () => {
        if (editableInputRef.current) {
            onRename(data.id, editableInputRef.current.value);
        }
        cancelRename();
    };

    const cancelRename = () => {
        if (editableSpanRef.current && editableInputRef.current) {
            editableSpanRef.current.hidden = false;
            editableInputRef.current.hidden = true;
        }
    };

    const startRename = () => {
        if (editableSpanRef.current && editableInputRef.current) {
            editableSpanRef.current.hidden = true;
            editableInputRef.current.hidden = false;
            editableInputRef.current.focus();
        }
    };

    useOutsideClick(() => {
        if (editableInputRef.current && !editableInputRef.current.hidden) {
            confirmRename();
        }
        console.log("Clicked outside!");
    }, editableInputRef);

    return (
        <div
            tabIndex={0}
            onClick={onClick}
            className={`note-selector-wrapper${
                isSelected ? " note-selected" : ""
            }`}
        >
            {[...Array(data.depth)].map(() => (
                <span className="indent-bar">|</span>
            ))}
            <span
                className="editable-label"
                onDoubleClick={startRename}
                ref={editableSpanRef}
            >
                {data.title}
            </span>
            <input
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                }}
                className="editable-input"
                hidden={true}
                ref={editableInputRef}
            />
        </div>
    );
}
