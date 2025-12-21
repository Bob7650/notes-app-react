import { useContext, useRef, useState, type MouseEvent } from "react";
import "./NoteSelector.style.css";
import useOutsideClick from "../../../../shared/hooks/useOutsideClick";
import type { NoteObject } from "../../../../shared/types/NoteObject";
import Popover from "../../../../shared/components/Popover";
import PopoverItem from "../../../../shared/components/PopoverItem";
import type { Rect } from "../../../../shared/types/Rect";
import { NotesContext } from "../../../../shared/context/NotesContext";

interface Props {
    data: NoteObject;
    onMouseDown?: (
        e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
    ) => void;
    isSelected?: boolean;
}

export default function NoteSelector({ data, onMouseDown, isSelected }: Props) {
    const dispatch = useContext(NotesContext)[1];

    const [inputValue, setInputValue] = useState<string>(data.title);
    const [isRenaming, setRenaming] = useState(false);

    const noteSelectorRef = useRef<HTMLInputElement>(null);

    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [anchor, setAnchor] = useState<Rect>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    const handleDisplayPopover = (newAnchor: Rect) => {
        setAnchor(newAnchor);
        setPopoverOpen(true);
    };

    const confirmRename = () => {
        dispatch({ type: "UPDATE", id: data.id, newTitle: inputValue });
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
        <>
            <div
                className={`note-selector-wrapper${
                    isSelected ? " note-selected" : ""
                }`}
                ref={noteSelectorRef}
                onContextMenu={(e) => e.preventDefault()}
                tabIndex={0}
                onMouseDown={(e) => {
                    if (e.button === 2) {
                        handleDisplayPopover({
                            x: e.clientX,
                            y: e.clientY,
                            width: 0,
                            height: 0,
                        });
                        e.stopPropagation();
                    }
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
                    <span
                        className="editable-label"
                        onDoubleClick={startRename}
                    >
                        {data.title}
                    </span>
                )}
            </div>
            <Popover
                isOpen={isPopoverOpen}
                anchor={anchor}
                onClose={() => {
                    setPopoverOpen(false);
                }}
            >
                <PopoverItem actionName="Copy" iconName="content_copy" />
                <PopoverItem
                    actionName="Rename"
                    iconName="edit"
                    onClick={() => {}}
                />
                <PopoverItem
                    actionName="Delete"
                    iconName="delete"
                    onClick={() => {
                        //handleDelete(data.id);
                    }}
                />
            </Popover>
        </>
    );
}
