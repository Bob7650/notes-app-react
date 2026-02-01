import { useContext } from "react";
import { DrawerContext } from "../../../../shared/context/DrawerContext/DrawerContext";
import type { Rect } from "../../../../shared/types/Rect";
import { FilesContext } from "../../../../shared/context/FilesContext/FilesContext";
import "./ItemInteractionManager.style.css";
import Folder from "./Folder";
import File from "./File";
import Droppable from "../../../../shared/components/Droppable";
import Draggable from "../../../../shared/components/Draggable";

interface Props {
    startFrom: string | "root";
    onCallPopover: (anchor: Rect, callerId: string) => void;
}

// TODO: put styles in a css file
export default function FolderTree({ startFrom, onCallPopover }: Props) {
    const { expandedId } = useContext(DrawerContext)!;
    const { childrenById } = useContext(FilesContext)!;

    return (
        <>
            {childrenById.get(startFrom)?.map((root) => (
                <div key={root.id} className="drawer-item-wrapper">
                    {root.type === "folder" ? (
                        <Droppable id={root.id}>
                            <Folder
                                drawerFolder={root}
                                hasParent={startFrom !== "root"}
                                onCallPopover={onCallPopover}
                            />

                            <div className="folder-children">
                                {expandedId.includes(root.id) &&
                                    childrenById
                                        .get(root.id)
                                        ?.map((child) => (
                                            <FolderTree
                                                key={child.id}
                                                startFrom={root.id}
                                                onCallPopover={onCallPopover}
                                            />
                                        ))}
                            </div>
                        </Droppable>
                    ) : (
                        <Draggable id={root.id}>
                            <File
                                drawerFile={root}
                                hasParent={startFrom !== "root"}
                                onCallPopover={onCallPopover}
                            />
                        </Draggable>
                    )}
                </div>
            ))}
        </>
    );
}
