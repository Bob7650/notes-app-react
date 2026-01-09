import { useContext, useState } from "react";
import IconButton from "../../../shared/components/IconButton";
import { DrawerContext } from "../../../shared/context/NotesContext/NotesContext";
import Selector from "./Selector/Selector";
import { CardsContext } from "../../../shared/context/TabsContext/CardsContext";
import Popover from "../../../shared/components/Popover";
import PopoverItem from "../../../shared/components/PopoverItem";
import type { Rect } from "../../../shared/types/Rect";
import EditableLabel from "../../../shared/components/EditableLabel";

export default function MainPageDrawer() {
    const { drawerMap, drawerActions, renamingId } = useContext(DrawerContext)!;
    const { selectedCardId, cardActions } = useContext(CardsContext)!;

    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [popoverCallerId, setPopoverCallerId] = useState<number | null>(null);
    const [anchor, setAnchor] = useState<Rect>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    const handleDisplayPopover = (newAnchor: Rect, callerId: number) => {
        setPopoverCallerId(callerId);
        setAnchor(newAnchor);
        setPopoverOpen(true);
    };

    const handleClosePopover = () => {
        if (isPopoverOpen) setPopoverOpen(false);
    };

    const handleNameChanged = (newValue: string, id: number) => {
        drawerActions.renameEntry(id, newValue);
        handleRenameCanceled();
    };

    const handleRenameCanceled = () => {
        drawerActions.cancelEntryRenaming();
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
                            drawerActions.addItem("note");
                        }}
                    />
                    <IconButton
                        iconName="create_new_folder"
                        onClick={() => {
                            drawerActions.addItem("folder");
                        }}
                    />
                    <IconButton iconName="sort_by_alpha" />
                </div>
                <div className="folders-section">
                    {drawerMap
                        .get("root")
                        ?.filter((item) => item.isFolder)
                        .map((folder) => (
                            <div key={folder.id}>
                                <Selector
                                    isSelected={selectedCardId === folder.id}
                                    onMouseDown={(e) => {
                                        if (e.button === 0) {
                                            // TODO: expand folder
                                        }
                                        if (e.button === 2) {
                                            handleDisplayPopover(
                                                {
                                                    x: e.clientX,
                                                    y: e.clientY,
                                                    width: 0,
                                                    height: 0,
                                                },
                                                folder.id
                                            );
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
                                        {/* TODO: change to isExpanded in the future */}
                                        {true
                                            ? "arrow_drop_down"
                                            : "arrow_right"}
                                    </span>
                                    <EditableLabel
                                        initialValue={folder.title}
                                        canEdit={folder.id === renamingId}
                                        onNameChanged={(newValue) =>
                                            handleNameChanged(
                                                newValue,
                                                folder.id
                                            )
                                        }
                                        onRenameCanceled={handleRenameCanceled}
                                    />
                                </Selector>
                            </div>
                        ))}
                </div>
                <div className="notes-section">
                    {drawerMap
                        .get("root")
                        ?.filter((item) => !item.isFolder)
                        .map((note) => (
                            <Selector
                                key={note.id}
                                isSelected={selectedCardId === note.id}
                                onMouseDown={(e) => {
                                    if (e.button === 0)
                                        cardActions.new({
                                            id: note.id,
                                            title: note.title,
                                        });
                                    if (e.button === 2) {
                                        handleDisplayPopover(
                                            {
                                                x: e.clientX,
                                                y: e.clientY,
                                                width: 0,
                                                height: 0,
                                            },
                                            note.id
                                        );
                                    }
                                }}
                            >
                                <EditableLabel
                                    initialValue={note.title}
                                    canEdit={note.id === renamingId}
                                    onNameChanged={(newValue) =>
                                        handleNameChanged(newValue, note.id)
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
                        drawerActions.setEntryRenaming(popoverCallerId!);
                    }}
                />
                <PopoverItem
                    actionName="Delete"
                    iconName="delete"
                    isDanger={true}
                    onClick={() => {
                        drawerActions.removeEntry(popoverCallerId!);
                    }}
                />
            </Popover>
        </aside>
    );
}
