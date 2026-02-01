import { useContext } from "react";
import EditableLabel from "../../../../shared/components/EditableLabel";
import ItemInteractionManager from "../InteractionManager/ItemInteractionManager";
import { MainPanelContext } from "../../../../shared/context/MainPanelContext/MainPanelContext";
import { DrawerContext } from "../../../../shared/context/DrawerContext/DrawerContext";
import type { Rect } from "../../../../shared/types/Rect";
import { FilesContext } from "../../../../shared/context/FilesContext/FilesContext";

interface Props {
    startFrom: string | "root";
    onCallPopover: (anchor: Rect, callerId: string) => void;
}

// TODO: put styles in a css file
export default function FolderManager({ startFrom, onCallPopover }: Props) {
    const { mainActions } = useContext(MainPanelContext)!;
    const { renamingId, drawerActions, expandedId } =
        useContext(DrawerContext)!;
    const { fileActions, childrenById } = useContext(FilesContext)!;

    const handleNameChanged = (newValue: string, id: string) => {
        fileActions.rename(id, newValue);
        handleRenameCanceled();
    };

    const handleRenameCanceled = () => {
        drawerActions.makeAllStatic();
    };

    return (
        <>
            {childrenById.get(startFrom)?.map((root) => (
                <div key={root.id} className="drawer-item-wrapper">
                    <ItemInteractionManager
                        itemId={root.id}
                        onMouseDown={(e) => {
                            if (e.button === 0) {
                                if (root.type === "note") {
                                    mainActions.openNote(root.id);
                                } else {
                                    drawerActions.expandFolder(root.id);
                                }
                            }

                            if (e.button === 2) {
                                onCallPopover(
                                    {
                                        x: e.clientX,
                                        y: e.clientY,
                                        width: 0,
                                        height: 0,
                                    },
                                    root.id,
                                );
                            }
                        }}
                    >
                        {root.type === "folder" ? (
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    position: "relative",
                                    top: 1,
                                    left: -3,
                                }}
                            >
                                {expandedId.find((expId) => expId === root.id)
                                    ? "arrow_drop_down"
                                    : "arrow_right"}
                            </span>
                        ) : (
                            startFrom != "root" && (
                                <div style={{ paddingLeft: 23 }} />
                            )
                        )}
                        <EditableLabel
                            initialValue={root.title}
                            canEdit={root.id === renamingId}
                            onNameChanged={(newValue) =>
                                handleNameChanged(newValue, root.id)
                            }
                            onRenameCanceled={handleRenameCanceled}
                        />
                    </ItemInteractionManager>
                    <div className="folder-children">
                        {expandedId.find(
                            (expId) =>
                                expId === root.id &&
                                childrenById
                                    .get(root.id)
                                    ?.map((child) => (
                                        <FolderManager
                                            key={child.id}
                                            startFrom={root.id}
                                            onCallPopover={onCallPopover}
                                        />
                                    )),
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}
