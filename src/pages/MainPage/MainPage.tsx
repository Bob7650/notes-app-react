import { useState } from "react";
import "./MainPage.style.css";
import MainPageDrawer from "./components/MainPageDrawer";
import MainPagePanel from "./components/MainPagePanel";
import NotesContextProvider from "../../shared/context/NotesContextProvider";

export default function MainPage() {
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [openedCards, setOpenedCards] = useState<number[]>([]);
    const cardActions = {
        new: (cardId: number) => {
            const tabId = cardId;
            setOpenedCards((tabs) =>
                tabs.includes(tabId) ? tabs : [...tabs, tabId]
            );

            setSelectedCardId(tabId);
        },
        close: (cardId: number) => {
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
                if (currentCardInd > 0)
                    newCardId = openedCards[currentCardInd - 1];
                else if (currentCardInd < openedCards.length)
                    newCardId = openedCards[currentCardInd + 1];
                setSelectedCardId(newCardId);
            }
            setOpenedCards(openedCards.filter((tab) => tab !== cardId));
        },
    };

    return (
        <NotesContextProvider>
            <div className="app-container">
                <MainPageDrawer
                    cardActions={cardActions}
                    selectedCardId={selectedCardId}
                />
                <MainPagePanel
                    cardActions={cardActions}
                    openedCards={openedCards}
                    selectedCardId={selectedCardId}
                />
            </div>
        </NotesContextProvider>
    );
}
