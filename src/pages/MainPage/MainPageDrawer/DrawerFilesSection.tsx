import FolderTree from "./FolderTree/FolderTree";
import { useContext, useState } from "react";
import type { Rect } from "../../../shared/types/Rect";
import Popover from "../../../shared/components/Popover";
import PopoverItem from "../../../shared/components/PopoverItem";
import { DrawerContext } from "../../../shared/context/DrawerContext/DrawerContext";
import { FilesContext } from "../../../shared/context/FilesContext/FilesContext";

export default function DrawerFilesSection() {
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

    return (
        <>
            <div className="folder-tree-section">
                <FolderTree onCallPopover={handleDisplayPopover} />
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
        </>
    );
}
