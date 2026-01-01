import { useContext, useRef, useState, type MouseEvent } from "react";
import "./NoteSelector.style.css";
import useOutsideClick from "../../../../shared/hooks/useOutsideClick";
import type { NoteObject } from "../../../../shared/types/NoteObject";
import { NotesContext } from "../../../../shared/context/NotesContext";
import Popover from "../../../../shared/components/Popover";
import PopoverItem from "../../../../shared/components/PopoverItem";
import type { Rect } from "../../../../shared/types/Rect";

interface Props {
    data: NoteObject;
    onMouseDown?: (
        e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
    ) => void;
    onDelete?: () => void;
    isSelected?: boolean;
}

export default function NoteSelector({
    data,
    onMouseDown,
    onDelete,
    isSelected,
}: Props) {
    //const dispatch = useContext(NotesContext)[1];
    const { notesActions } = useContext(NotesContext);

    const [inputValue, setInputValue] = useState<string>(data.title);
    const [isRenaming, setRenaming] = useState(false);

    const noteSelectorRef = useRef<HTMLInputElement>(null);

    const confirmRename = () => {
        //dispatch({ type: "UPDATE", id: data.id, newTitle: inputValue });
        notesActions.rename(data.id, inputValue);
        cancelRename();
    };

    const cancelRename = () => {
        setRenaming(false);
    };

    const startRename = () => {
        setRenaming(true);
    };

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
                    onMouseDown?.(e);
                    if (e.button === 2) {
                        handleDisplayPopover({
                            x: e.clientX,
                            y: e.clientY,
                            width: 0,
                            height: 0,
                        });
                        e.stopPropagation();
                    }
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
                <PopoverItem
                    actionName="Copy"
                    iconName="content_copy"
                    onClick={() => {}}
                />
                <PopoverItem
                    actionName="Rename"
                    iconName="edit"
                    onClick={() => {
                        startRename();
                    }}
                />
                <PopoverItem
                    actionName="Delete"
                    iconName="delete"
                    isDanger={true}
                    onClick={() => {
                        notesActions.remove(data.id);
                        onDelete?.();
                    }}
                />
            </Popover>
        </>
    );
}
