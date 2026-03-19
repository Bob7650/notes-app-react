import { useContext, useMemo, useState } from "react";
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
    type DragOverEvent,
} from "@dnd-kit/core";
import {
    getFileSpan,
    getIdsInRange,
    getParentFolderOf,
    getValidDrops,
} from "../../../../shared/utils/FolderTreeUtils";

interface Props {
    onCallPopover: (anchor: Rect, callerId: string) => void;
}

export default function FolderTree({ onCallPopover }: Props) {
    const { expandedId, renamingId } = useContext(DrawerContext)!;
    const { drawerItems, fileActions } = useContext(FilesContext)!;

    const [validDrops, setValidDrops] = useState<DrawerFile[]>([]);
    const [highlitghtedRange, setHighlightedRange] = useState<string[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
    );

    const visibleNodes = useMemo(() => {
        const result: DrawerFile[] = [];
        let hiddenUntilDepth: number | null = null;

        for (const node of drawerItems) {
            if (node.id === "root") continue;

            if (hiddenUntilDepth !== null && node.depth > hiddenUntilDepth)
                continue;

            hiddenUntilDepth = null;
            result.push(node);

            if (!expandedId.includes(node.id)) {
                hiddenUntilDepth = node.depth;
            }
        }

        return result;
    }, [drawerItems, expandedId]);

    const handleDragEnd = (e: DragEndEvent) => {
        setValidDrops([]);
        setHighlightedRange([]);

        const activeItem = drawerItems.find((item) => item.id === e.active.id);
        if (!activeItem) return;
        const overItem = drawerItems.find((item) => item.id === e.over?.id);
        if (!overItem) return;

        let parentFolder: DrawerFile | undefined = undefined;
        if (overItem.type === "note") {
            parentFolder = getParentFolderOf(overItem, drawerItems);
        }

        fileActions.dropFileToFolder(activeItem, parentFolder ?? overItem);
    };

    const handleDragOver = (e: DragOverEvent) => {
        const overItem = drawerItems.find((item) => item.id === e.over?.id);
        if (!overItem) {
            setHighlightedRange([]);
            return;
        }

        let parentFolder: DrawerFile | undefined = undefined;
        if (overItem.type === "note") {
            parentFolder = getParentFolderOf(overItem, drawerItems);
        }

        const { startInd, endInd } = getFileSpan(
            parentFolder ?? overItem,
            drawerItems,
        );
        setHighlightedRange(getIdsInRange(startInd, endInd, drawerItems));
    };

    return (
        <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onDragStart={(e) => {
                setValidDrops(
                    getValidDrops(e.active.id.toString(), drawerItems),
                );
            }}
            onDragOver={handleDragOver}
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
                                    highlighted={highlitghtedRange.includes(
                                        item.id,
                                    )}
                                />
                            </Draggable>
                        </Droppable>
                    ) : (
                        <Droppable
                            id={item.id}
                            canDropInto={validDrops.includes(item)}
                        >
                            <Draggable
                                id={item.id}
                                canDrag={item.id !== renamingId}
                            >
                                <File
                                    drawerFile={item}
                                    onCallPopover={onCallPopover}
                                    highlighted={highlitghtedRange.includes(
                                        item.id,
                                    )}
                                />
                            </Draggable>
                        </Droppable>
                    )}
                </div>
            ))}
            {
                // TODO: make this
            }
            <DragOverlay>Hello</DragOverlay>
        </DndContext>
    );
}
