import { useState } from "react";
import "./MainPage.style.css";
import MainPageDrawer from "./components/MainPageDrawer";
import MainPagePanel from "./components/MainPagePanel";
import NotesContextProvider from "../../shared/context/NotesContextProvider";

export default function MainPage() {
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [openedCards, setOpenedCards] = useState<number[]>([]);

    /**
     * Changes/creates new tab
     * @param noteId id of a note, that wants its card to be opened
     */
    const handleNewCard = (noteId: number) => {
        const tabId = noteId;
        setOpenedCards((tabs) =>
            tabs.includes(tabId) ? tabs : [...tabs, tabId]
        );

        setSelectedCardId(tabId);
    };

    /**
     * Closes already opened card
     * @param cardId id of a card to be closed
     */
    const handleCloseCard = (cardId: number) => {
        if (cardId === selectedCardId) {
            const currentCardInd = openedCards.findIndex(
                (card) => card === cardId
            );

            if (currentCardInd === -1) {
                console.error(
                    "No current card opened! (This shouldn't happen)"
                );
            }

            let newCardId: number | null = null;
            if (currentCardInd > 0) newCardId = openedCards[currentCardInd - 1];
            else if (currentCardInd < openedCards.length)
                newCardId = openedCards[currentCardInd + 1];
            setSelectedCardId(newCardId);
        }
        setOpenedCards(openedCards.filter((tab) => tab !== cardId));
    };

    return (
        <NotesContextProvider>
            <div className="app-container">
                <MainPageDrawer
                    handleNewTab={handleNewCard}
                    selectedCardId={selectedCardId}
                />
                <MainPagePanel
                    handleNewCard={handleNewCard}
                    handleCloseCard={handleCloseCard}
                    openedCards={openedCards}
                    selectedCardId={selectedCardId}
                />
            </div>
        </NotesContextProvider>
    );
}
