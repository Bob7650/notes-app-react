import { useCallback, useContext, useMemo, useState } from "react";
import { DrawerContext } from "../../../../shared/context/DrawerContext/DrawerContext";
import type { Rect } from "../../../../shared/types/Rect";
import { FilesContext } from "../../../../shared/context/FilesContext/FilesContext";
import "./ItemInteractionManager.style.css";
import Folder from "./Folder";
import File from "./File";
import Droppable from "../../../../shared/components/Droppable";
import Draggable from "../../../../shared/components/Draggable";
import type { DrawerFile } from "../../../../shared/types/DrawerFile";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";

interface Props {
    onCallPopover: (anchor: Rect, callerId: string) => void;
}

export default function FolderTree({ onCallPopover }: Props) {
    const { expandedId } = useContext(DrawerContext)!;
    const { drawerItems, fileActions } = useContext(FilesContext)!;

    const visibleNodes = useMemo(() => {
        const result: DrawerFile[] = [];
        const hiddenDepths = new Set<number>();

        for (const node of drawerItems) {
            // If this node is hidden by a collapsed ancestor
            if ([...hiddenDepths].some((d) => node.depth > d)) {
                continue;
            }

            result.push(node);

            // If this node is collapsed, hide its children
            if (expandedId.includes(node.id)) {
                hiddenDepths.add(node.depth);
            }

            // Clean up when we move back up the tree
            for (const d of [...hiddenDepths]) {
                if (node.depth <= d) {
                    hiddenDepths.delete(d);
                }
            }
        }

        return result;
    }, [drawerItems]);

    const [validDrops, setValidDrops] = useState<DrawerFile[]>([]);
    const getValidDrops = useCallback(
        (draggedId: string): DrawerFile[] => {
            const { startInd, endInd } = getSubtreeRange(
                drawerItems,
                draggedId,
            );
            const validDrops = drawerItems.slice();
            validDrops.splice(startInd, endInd - startInd);
            return validDrops;
        },
        [drawerItems],
    );

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
    );

    const handleDragEnd = (e: DragEndEvent) => {
        console.log(`Drag ended ${e.over?.id}`);
        setValidDrops([]);
        if (e.over)
            fileActions.setParent(e.active.id.toString(), e.over.id.toString());
    };

    return (
        <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onDragStart={(e) => {
                console.log("Calculate valid drops list");
                setValidDrops(getValidDrops(e.active.id.toString()));
            }}
        >
            {visibleNodes.map((item) => (
                <div key={item.id} className="drawer-item-wrapper">
                    {item.type === "folder" ? (
                        <Droppable
                            id={item.id}
                            canDropInto={
                                validDrops.includes(
                                    item,
                                ) /*Check here if item.id in valid drops list*/
                            }
                        >
                            <Folder
                                drawerFolder={item}
                                onCallPopover={onCallPopover}
                            />
                        </Droppable>
                    ) : (
                        <Draggable
                            id={item.id}
                            canDrag={true /*Turn this to false when renaming*/}
                        >
                            <File
                                drawerFile={item}
                                onCallPopover={onCallPopover}
                            />
                        </Draggable>
                    )}
                </div>
            ))}
            <DragOverlay>Hello</DragOverlay>
        </DndContext>
    );
}

function getSubtreeRange(
    files: DrawerFile[],
    rootId: string,
): { startInd: number; endInd: number } {
    const rootFile = files.find((item) => item.id === rootId);
    if (!rootFile) return { startInd: 0, endInd: 0 };

    const rootDepth = rootFile.depth;
    const startInd = files.indexOf(rootFile);

    let endInd = startInd;
    while (++endInd < files.length && files[endInd].depth > rootDepth);

    return { startInd: startInd, endInd: endInd };
}
