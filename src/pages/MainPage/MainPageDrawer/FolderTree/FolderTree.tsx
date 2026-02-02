import { useCallback, useContext, useMemo, useState } from "react";
import { DrawerContext } from "../../../../shared/context/DrawerContext/DrawerContext";
import type { Rect } from "../../../../shared/types/Rect";
import { FilesContext } from "../../../../shared/context/FilesContext/FilesContext";
import "./DrawerItem.style.css";
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
import { getSubtreeRange } from "../../../../shared/hooks/useFiles";

interface Props {
    onCallPopover: (anchor: Rect, callerId: string) => void;
}

export default function FolderTree({ onCallPopover }: Props) {
    const { expandedId, renamingId } = useContext(DrawerContext)!;
    const { drawerItems, fileActions } = useContext(FilesContext)!;

    const visibleNodes = useMemo(() => {
        const result: DrawerFile[] = [];
        let hiddenUntilDepth: number | null = null;

        for (const node of drawerItems) {
            if (hiddenUntilDepth !== null && node.depth > hiddenUntilDepth) {
                continue;
            }

            hiddenUntilDepth = null;
            result.push(node);

            if (!expandedId.includes(node.id)) {
                hiddenUntilDepth = node.depth;
            }
        }

        return result;
    }, [drawerItems, expandedId]);

    const [validDrops, setValidDrops] = useState<DrawerFile[]>([]);
    const getValidDrops = useCallback(
        (draggedId: string): DrawerFile[] => {
            const { startInd, endInd } = getSubtreeRange(
                drawerItems,
                draggedId,
            );
            const validDrops = drawerItems.slice();
            validDrops.splice(startInd, endInd - startInd + 1);
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
        //console.log(`Drag ended ${e.over?.id}`);
        setValidDrops([]);
        if (e.over)
            fileActions.dropFileToFolder(
                e.active.id.toString(),
                e.over.id.toString(),
            );
    };

    return (
        <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onDragStart={(e) => {
                //console.log("Calculate valid drops list");
                setValidDrops(getValidDrops(e.active.id.toString()));
            }}
        >
            {visibleNodes.map((item) => (
                <div key={item.id} className="drawer-item-wrapper">
                    {item.type === "folder" ? (
                        <Droppable
                            id={item.id}
                            canDropInto={validDrops.includes(item)}
                        >
                            <Draggable
                                id={item.id}
                                canDrag={item.id !== renamingId}
                            >
                                <Folder
                                    drawerFolder={item}
                                    onCallPopover={onCallPopover}
                                />
                            </Draggable>
                        </Droppable>
                    ) : (
                        <Draggable
                            id={item.id}
                            canDrag={item.id !== renamingId}
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
