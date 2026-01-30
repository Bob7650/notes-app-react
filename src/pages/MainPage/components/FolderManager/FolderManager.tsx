import { useContext } from "react";
import EditableLabel from "../../../../shared/components/EditableLabel";
import ItemInteractionManager from "../InteractionManager/ItemInteractionManager";
import { CardsContext } from "../../../../shared/context/TabsContext/CardsContext";
import { DrawerContext } from "../../../../shared/context/NotesContext/NotesContext";
import type { Rect } from "../../../../shared/types/Rect";

interface Props {
    startFrom: number | "root";
    onCallPopover: (anchor: Rect, callerId: number) => void;
}

// TODO: put styles in a css file
export default function FolderManager({ startFrom, onCallPopover }: Props) {
    const { selectedCardId, cardActions } = useContext(CardsContext)!;
    const { renamingId, drawerActions, drawerMap } = useContext(DrawerContext)!;

    const handleNameChanged = (newValue: string, id: number) => {
        drawerActions.renameEntry(id, newValue);
        handleRenameCanceled();
    };

    const handleRenameCanceled = () => {
        drawerActions.cancelEntryRenaming();
    };

    return (
        <>
            {drawerMap.get(startFrom)?.map((root) => (
                <div key={root.id} className="drawer-item-wrapper">
                    <ItemInteractionManager
                        isSelected={selectedCardId === root.id}
                        onMouseDown={(e) => {
                            if (e.button === 0) {
                                if (!root.isFolder) {
                                    cardActions.new({
                                        id: root.id,
                                        title: root.title,
                                    });
                                } else {
                                    drawerActions.expandFolder(root.id);
                                    console.log(
                                        `Expanded folder id: ${root.id}`,
                                    );
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
                        {root.isFolder ? (
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    position: "relative",
                                    top: 1,
                                    left: -3,
                                }}
                            >
                                {root.isExpanded
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
                        {root.isExpanded &&
                            drawerMap
                                .get(root.id)
                                ?.map((child) => (
                                    <FolderManager
                                        key={child.id}
                                        startFrom={root.id}
                                        onCallPopover={onCallPopover}
                                    />
                                ))}
                    </div>
                </div>
            ))}
        </>
    );
}
