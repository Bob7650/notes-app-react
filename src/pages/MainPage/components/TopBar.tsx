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
    type UniqueIdentifier,
} from "@dnd-kit/core";
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
} from "@dnd-kit/sortable";
import CardPlaceholder from "./NoteCard/CardPlaceholder";
import { CardsContext } from "../../../shared/context/TabsContext/CardsContext";

export default function TopBar() {
    const mainTopBarRef = useRef<HTMLDivElement>(null);
    const { selectedCardId, openedCards, cardActions } =
        useContext(CardsContext)!!;
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    const handleDragStart = (e: DragEndEvent) => {
        const { active } = e;

        setActiveId(active.id);
    };

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;

        if (over && active.id !== over.id) {
            cardActions.set((cards) => {
                const oldIndex = cards.findIndex(
                    (card) => card.id === active.id
                );
                const newIndex = cards.findIndex((card) => card.id === over.id);
                return arrayMove(cards, oldIndex, newIndex);
            });
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
                        items={openedCards}
                        strategy={horizontalListSortingStrategy}
                    >
                        {openedCards.map((card) => (
                            <NoteCard
                                key={card.id}
                                id={card.id}
                                title={card.title}
                                isSelected={selectedCardId === card.id}
                                onClick={() => {
                                    // Introduce switch maybe
                                    cardActions.new(card);
                                }}
                                onClose={() => cardActions.close(card.id)}
                            />
                        ))}
                    </SortableContext>
                    <DragOverlay>
                        {activeId ? (
                            <CardPlaceholder
                                title={
                                    openedCards.find(
                                        (card) => card.id === Number(activeId)
                                    )?.title
                                }
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}
