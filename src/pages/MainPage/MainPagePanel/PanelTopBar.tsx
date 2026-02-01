import { useContext, useRef, useState, type WheelEvent } from "react";
import NoteCard from "./NoteCard/NoteCard";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    horizontalListSortingStrategy,
    SortableContext,
} from "@dnd-kit/sortable";
import CardPlaceholder from "./NoteCard/CardPlaceholder";
import { MainPanelContext } from "../../../shared/context/MainPanelContext/MainPanelContext";
import { FilesContext } from "../../../shared/context/FilesContext/FilesContext";

export default function PanelTopBar() {
    const mainTopBarRef = useRef<HTMLDivElement>(null);
    const { selectedFileId, mainActions, openedFiles } =
        useContext(MainPanelContext)!;
    const { titleById } = useContext(FilesContext)!;
    const [activeId, setActiveId] = useState<string | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
    );

    const handleDragStart = (e: DragEndEvent) => {
        const { active } = e;

        setActiveId(active.id.toString());
    };

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;

        if (over && active.id !== over.id) {
            mainActions.swapTabsPosition(
                over.id.toString(),
                active.id.toString(),
            );
        }

        setActiveId(null);
    };

    const handleWheel = (e: WheelEvent) => {
        if (!mainTopBarRef.current) return;

        if (
            mainTopBarRef.current.scrollWidth >
            mainTopBarRef.current.clientWidth
        ) {
            mainTopBarRef.current.scrollLeft += e.deltaY;
        }
    };

    return (
        <div
            className="main-top-bar bordered"
            onWheel={handleWheel}
            ref={mainTopBarRef}
        >
            <div className="cards-section">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={openedFiles}
                        strategy={horizontalListSortingStrategy}
                    >
                        {openedFiles.map((fileId) => (
                            <NoteCard
                                key={fileId}
                                id={fileId}
                                title={titleById[fileId]}
                                isSelected={selectedFileId === fileId}
                                onClick={() => {
                                    mainActions.openNote(fileId);
                                }}
                                onClose={() => mainActions.closeNote(fileId)}
                            />
                        ))}
                    </SortableContext>
                    <DragOverlay>
                        {activeId ? (
                            <CardPlaceholder title={titleById[activeId]} />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}
