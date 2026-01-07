import { useContext, useState } from "react";
import IconButton from "../../../shared/components/IconButton";
import { NotesContext } from "../../../shared/context/NotesContext/NotesContext";
import Selector from "./Selector/Selector";
import { TabsContext } from "../../../shared/context/TabsContext/TabsContext";
import Popover from "../../../shared/components/Popover";
import PopoverItem from "../../../shared/components/PopoverItem";
import type { Rect } from "../../../shared/types/Rect";
import EditableLabel from "../../../shared/components/EditableLabel";

export default function MainPageDrawer() {
    const { notes, notesActions, renamingNoteId } = useContext(NotesContext)!!;
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

    const handleNameChanged = (newValue: string, id: number) => {
        notesActions.rename(id, newValue);
        handleRenameCanceled();
    };

    const handleRenameCanceled = () => {
        notesActions.setRenaming(null);
    };

    const testFolder = { id: 12, title: "Siema", notes: [] };

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
                <div className="folders-section">
                    <Selector
                        key={testFolder.id}
                        isSelected={selectedCardId === testFolder.id}
                        onMouseDown={(e) => {
                            if (e.button === 0) {
                                // Expand/Hide notes
                            }
                            if (e.button === 2) {
                                setPopoverCallerId(testFolder.id);
                                handleDisplayPopover({
                                    x: e.clientX,
                                    y: e.clientY,
                                    width: 0,
                                    height: 0,
                                });
                            }
                        }}
                    >
                        {/* This is temporary, change in the future */}
                        <span
                            className="material-symbols-outlined"
                            style={{
                                position: "relative",
                                top: 1,
                                left: -3,
                            }}
                        >
                            chevron_right
                        </span>
                        <EditableLabel
                            initialValue={testFolder.title}
                            canEdit={testFolder.id === renamingNoteId}
                            onNameChanged={(newValue) =>
                                handleNameChanged(newValue, testFolder.id)
                            }
                            onRenameCanceled={handleRenameCanceled}
                        />
                    </Selector>
                </div>
                <div className="notes-section">
                    {notes.map((singleNote) => (
                        <Selector
                            key={singleNote.id}
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
                        >
                            <EditableLabel
                                initialValue={singleNote.title}
                                canEdit={singleNote.id === renamingNoteId}
                                onNameChanged={(newValue) =>
                                    handleNameChanged(newValue, singleNote.id)
                                }
                                onRenameCanceled={handleRenameCanceled}
                            />
                        </Selector>
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
