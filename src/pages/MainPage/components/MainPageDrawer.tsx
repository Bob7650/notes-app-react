import { useContext, useState } from "react";
import IconButton from "../../../shared/components/IconButton";
import { DrawerContext } from "../../../shared/context/DrawerContext/DrawerContext";
import Popover from "../../../shared/components/Popover";
import PopoverItem from "../../../shared/components/PopoverItem";
import type { Rect } from "../../../shared/types/Rect";
import FolderManager from "./FolderManager/FolderManager";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { FilesContext } from "../../../shared/context/FilesContext/FilesContext";

export default function MainPageDrawer() {
    const { drawerActions } = useContext(DrawerContext)!;
    const { fileActions } = useContext(FilesContext)!;

    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [popoverCallerId, setPopoverCallerId] = useState<string | null>(null);
    const [anchor, setAnchor] = useState<Rect>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    const handleDisplayPopover = (newAnchor: Rect, callerId: string) => {
        setPopoverCallerId(callerId);
        setAnchor(newAnchor);
        setPopoverOpen(true);
    };

    const handleClosePopover = () => {
        if (isPopoverOpen) setPopoverOpen(false);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
    );

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
                            fileActions.add("note");
                        }}
                    />
                    <IconButton
                        iconName="create_new_folder"
                        onClick={() => {
                            fileActions.add("folder");
                        }}
                    />
                    <IconButton iconName="sort_by_alpha" />
                </div>
                <div className="folders-section">
                    <DndContext sensors={sensors}>
                        <FolderManager
                            startFrom="root"
                            onCallPopover={handleDisplayPopover}
                        />
                        <DragOverlay>Hello</DragOverlay>
                    </DndContext>
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
                        drawerActions.makeEditable(popoverCallerId!);
                    }}
                />
                <PopoverItem
                    actionName="Delete"
                    iconName="delete"
                    isDanger={true}
                    onClick={() => {
                        fileActions.remove(popoverCallerId!);
                    }}
                />
            </Popover>
        </aside>
    );
}
