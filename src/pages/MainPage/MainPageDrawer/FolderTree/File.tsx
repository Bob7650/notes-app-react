import { useContext, type MouseEvent } from "react";
import { MainPanelContext } from "../../../../shared/context/MainPanelContext/MainPanelContext";
import type { DrawerFile } from "../../../../shared/types/DrawerFile";
import EditableLabel from "../../../../shared/components/EditableLabel";
import { DrawerContext } from "../../../../shared/context/DrawerContext/DrawerContext";
import { FilesContext } from "../../../../shared/context/FilesContext/FilesContext";

interface Props {
    drawerFile: DrawerFile;
    hasParent: boolean;
    onCallPopover: any;
}

export default function File({ drawerFile, hasParent, onCallPopover }: Props) {
    const { mainActions, selectedFileId } = useContext(MainPanelContext)!;
    const { renamingId, drawerActions } = useContext(DrawerContext)!;
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
            mainActions.openNote(drawerFile.id);
        }
        if (e.button === 2) {
            onCallPopover(
                {
                    x: e.clientX,
                    y: e.clientY,
                    width: 0,
                    height: 0,
                },
                drawerFile.id,
            );
        }
    };

    return (
        <div
            className={`selector-wrapper${
                drawerFile.id === selectedFileId ? " selector-selected" : ""
            }`}
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={handleMouseDown}
        >
            {hasParent && <div style={{ paddingLeft: 23 }} />}
            <EditableLabel
                initialValue={drawerFile.title}
                canEdit={drawerFile.id === renamingId}
                onNameChanged={(newValue) =>
                    handleNameChanged(newValue, drawerFile.id)
                }
                onRenameCanceled={handleRenameCanceled}
            />
        </div>
    );
}
