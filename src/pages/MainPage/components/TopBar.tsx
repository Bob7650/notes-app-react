import {
    useContext,
    useRef,
    useState,
    type SetStateAction,
    type WheelEvent,
} from "react";
import NoteCard from "./NoteCard/NoteCard";
import { NotesContext } from "../../../shared/context/NotesContext/NotesContext";
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

interface Props {
    cardActions: {
        new: (cardId: number) => void;
        close: (cardId: number) => void;
        set: (value: SetStateAction<number[]>) => void;
    };
    openedCards: number[];
    selectedCardId: number | null;
}

export default function TopBar({
    cardActions,
    openedCards,
    selectedCardId,
}: Props) {
    const mainTopBarRef = useRef<HTMLDivElement>(null);
    const { notes } = useContext(NotesContext);
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
            cardActions.set((cards: number[]) => {
                const oldIndex = cards.indexOf(Number(active.id));
                const newIndex = cards.indexOf(Number(over.id));
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
                                key={card}
                                id={card}
                                title={
                                    notes.find((note) => note.id === card)
                                        ?.title
                                }
                                isSelected={selectedCardId === card}
                                onClick={() => {
                                    cardActions.new(card);
                                }}
                                onClose={() => cardActions.close(card)}
                            />
                        ))}
                    </SortableContext>
                    <DragOverlay>
                        {activeId ? (
                            <CardPlaceholder
                                title={
                                    notes.find(
                                        (note) => note.id === Number(activeId)
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
