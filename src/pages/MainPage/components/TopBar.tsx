import { useContext, useRef } from "react";
import NoteCard from "./NoteCard/NoteCard";
import { NotesContext } from "../../../shared/context/NotesContext";

interface Props {
    cardActions: {
        new: (cardId: number) => void;
        close: (cardId: number) => void;
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
    const cardRef = useRef<HTMLLIElement>(null);

    const { notes } = useContext(NotesContext);

    return (
        <div
            className="main-top-bar bordered"
            onWheel={(e) => {
                if (!mainTopBarRef.current) return;

                if (
                    mainTopBarRef.current.scrollWidth >
                    mainTopBarRef.current.clientWidth
                ) {
                    e.preventDefault();
                    mainTopBarRef.current.scrollLeft += e.deltaY;
                }
            }}
            ref={mainTopBarRef}
        >
            <ul className="cards-section">
                {openedCards.map((card) => (
                    <li key={card} ref={cardRef}>
                        <NoteCard
                            title={
                                notes.find((note) => note.id === card)?.title ??
                                ""
                            }
                            isSelected={selectedCardId === card}
                            onClick={() => {
                                cardActions.new(card);
                            }}
                            onClose={() => cardActions.close(card)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
