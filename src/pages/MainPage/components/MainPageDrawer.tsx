import { useContext, useState } from "react";
import IconButton from "../../../shared/components/IconButton";
import { NotesContext } from "../../../shared/context/NotesContext/NotesContext";
import NoteSelector from "./NoteSelector/NoteSelector";
import { TabsContext } from "../../../shared/context/TabsContext/TabsContext";
import Popover from "../../../shared/components/Popover";
import PopoverItem from "../../../shared/components/PopoverItem";
import type { Rect } from "../../../shared/types/Rect";

export default function MainPageDrawer() {
    const { notes, notesActions } = useContext(NotesContext)!!;
    const { selectedCardId, cardActions } = useContext(TabsContext);

    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [popoverCallerId, setPopoverCallerId] = useState<number | null>(null);
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

    const handleClosePopover = () => {
        if (isPopoverOpen) setPopoverOpen(false);
    };

    return (
        <aside className="drawer-section">
            <div className="drawer-top-bar bordered">
                <IconButton iconName="folder" />
                <IconButton iconName="search" />
            </div>
            <div className="drawer-contents bordered">
                <div className="top-icons-section">
                    <IconButton
                        iconName="edit_square"
                        onClick={() => {
                            notesActions.add();
                        }}
                    />
                    <IconButton iconName="create_new_folder" />
                    <IconButton iconName="sort_by_alpha" />
                </div>
                <div className="folders-section"></div>
                <div className="notes-section">
                    {notes.map((singleNote) => (
                        <NoteSelector
                            key={singleNote.id}
                            data={singleNote}
                            isSelected={selectedCardId === singleNote.id}
                            onMouseDown={(e) => {
                                if (e.button === 0)
                                    cardActions.new(singleNote.id);
                                if (e.button === 2) {
                                    setPopoverCallerId(singleNote.id);
                                    handleDisplayPopover({
                                        x: e.clientX,
                                        y: e.clientY,
                                        width: 0,
                                        height: 0,
                                    });
                                }
                            }}
                        />
                    ))}
                </div>
            </div>
            <Popover
                isOpen={isPopoverOpen}
                anchor={anchor}
                onClose={handleClosePopover}
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
                        notesActions.setRenaming(popoverCallerId);
                    }}
                />
                <PopoverItem
                    actionName="Delete"
                    iconName="delete"
                    isDanger={true}
                    onClick={() => {
                        notesActions.remove(popoverCallerId);
                    }}
                />
            </Popover>
        </aside>
    );
}
