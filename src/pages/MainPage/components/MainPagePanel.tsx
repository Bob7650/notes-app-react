import { useRef } from "react";
import NoteCard from "../../../shared/components/NoteCard";
import IconButton from "../../../shared/components/IconButton";
import TextEditor from "../../../shared/components/TextEditor";
import type { NoteObject } from "../../../shared/types/NoteObject";
import type { Rect } from "../../../shared/types/Rect";

interface Props {
    handleUpdate: (newContents: string, noteId: number) => void;
    handleNewCard: (noteId: number) => void;
    handleCloseCard: (cardId: number) => void;
    handleDisplayPopover: (callerId: number, newAnchor: Rect) => void;
    openedCards: number[];
    selectedCardId: number | null;
    notesSnapshot: NoteObject[];
}

export default function MainPagePanel({
    handleUpdate,
    handleNewCard,
    handleCloseCard,
    handleDisplayPopover,
    openedCards,
    selectedCardId,
    notesSnapshot,
}: Props) {
    const mainTopBarRef = useRef<HTMLDivElement>(null);
    const moreButtonRef = useRef<HTMLButtonElement>(null);

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
                                    notesSnapshot.find(
                                        (note) => note.id === card
                                    )?.title
                                        ? notesSnapshot.find(
                                              (note) => note.id === card
                                          )?.title!!
                                        : ""
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
                    <IconButton
                        iconName="more_vert"
                        ref={moreButtonRef}
                        onClick={() => {
                            if (moreButtonRef.current) {
                                const buttonData =
                                    moreButtonRef.current.getBoundingClientRect();
                                const anchor: Rect = {
                                    x: buttonData.x,
                                    y: buttonData.y,
                                    width: buttonData.width,
                                    height: buttonData.height,
                                };
                                handleDisplayPopover(selectedCardId!!, anchor);
                            }
                        }}
                    />
                </div>
                <div className="note-section">
                    <div className="editor-wrapper">
                        <TextEditor
                            noteId={selectedCardId ? selectedCardId : -1}
                            initialValue={
                                notesSnapshot.find(
                                    (note) => note.id === selectedCardId
                                )?.content!!
                            }
                            onChange={() => {}}
                            onChangeDebounce={(updatedContent) =>
                                handleUpdate(updatedContent, selectedCardId!!)
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
