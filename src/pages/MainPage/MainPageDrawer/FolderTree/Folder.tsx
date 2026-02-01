import { useContext, type MouseEvent } from "react";
import type { DrawerFile } from "../../../../shared/types/DrawerFile";
import { MainPanelContext } from "../../../../shared/context/MainPanelContext/MainPanelContext";
import { DrawerContext } from "../../../../shared/context/DrawerContext/DrawerContext";
import { FilesContext } from "../../../../shared/context/FilesContext/FilesContext";
import EditableLabel from "../../../../shared/components/EditableLabel";

interface Props {
    drawerFolder: DrawerFile;
    hasParent: boolean;
    onCallPopover: any;
}

export default function Folder({
    drawerFolder,
    hasParent,
    onCallPopover,
}: Props) {
    const { selectedFileId } = useContext(MainPanelContext)!;
    const { renamingId, drawerActions, expandedId } =
        useContext(DrawerContext)!;
    const { fileActions } = useContext(FilesContext)!;

    const handleNameChanged = (newValue: string, id: string) => {
        fileActions.rename(id, newValue);
        handleRenameCanceled();
    };

    const handleRenameCanceled = () => {
        drawerActions.makeAllStatic();
    };

    const handleMouseDown = (
        e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    ) => {
        if (e.button === 0) {
            drawerActions.expandFolder(drawerFolder.id);
        }
        if (e.button === 2) {
            onCallPopover(
                {
                    x: e.clientX,
                    y: e.clientY,
                    width: 0,
                    height: 0,
                },
                drawerFolder.id,
            );
        }
    };

    return (
        <div
            className={`selector-wrapper${
                drawerFolder.id === selectedFileId ? " selector-selected" : ""
            }`}
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={handleMouseDown}
        >
            {hasParent && <div style={{ paddingLeft: 23 }} />}
            <span
                className="material-symbols-outlined"
                style={{
                    position: "relative",
                    top: 1,
                    left: -3,
                }}
            >
                {expandedId.includes(drawerFolder.id)
                    ? "arrow_drop_down"
                    : "arrow_right"}
            </span>
            <EditableLabel
                initialValue={drawerFolder.title}
                canEdit={drawerFolder.id === renamingId}
                onNameChanged={(newValue) =>
                    handleNameChanged(newValue, drawerFolder.id)
                }
                onRenameCanceled={handleRenameCanceled}
            />
        </div>
    );
}
