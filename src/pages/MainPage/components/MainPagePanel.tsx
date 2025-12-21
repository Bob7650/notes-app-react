import { useContext, useRef } from "react";
import NoteCard from "./NoteCard/NoteCard";
import IconButton from "../../../shared/components/IconButton";
import TextEditor from "./TextEditor/TextEditor";
import { NotesContext } from "../../../shared/context/NotesContext";

interface Props {
    handleNewCard: (noteId: number) => void;
    handleCloseCard: (cardId: number) => void;
    openedCards: number[];
    selectedCardId: number | null;
}

export default function MainPagePanel({
    handleNewCard,
    handleCloseCard,
    openedCards,
    selectedCardId,
}: Props) {
    const [notes, dispatch] = useContext(NotesContext);

    const mainTopBarRef = useRef<HTMLDivElement>(null);

    return (
        <div className="main-panel-section">
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
                        <li key={card}>
                            <NoteCard
                                title={
                                    notes.find((note) => note.id === card)
                                        ?.title ?? ""
                                }
                                isSelected={selectedCardId === card}
                                onClick={() => {
                                    handleNewCard(card);
                                }}
                                onClose={() => handleCloseCard(card)}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <div className="note-tools-section bordered">
                <div className="tools-section">
                    <div className="arrow-container">
                        <IconButton iconName="arrow_back" />
                        <IconButton iconName="arrow_forward" />
                    </div>
                    <IconButton iconName="more_vert" />
                </div>
                <div className="note-section">
                    <div className="editor-wrapper">
                        <TextEditor
                            noteId={selectedCardId ? selectedCardId : -1}
                            initialValue={
                                notes.find((note) => note.id === selectedCardId)
                                    ?.content ?? ""
                            }
                            onChange={() => {}}
                            onChangeDebounce={(updatedContent) =>
                                dispatch({
                                    type: "UPDATE",
                                    id: selectedCardId ?? -1,
                                    newContent: updatedContent,
                                })
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
