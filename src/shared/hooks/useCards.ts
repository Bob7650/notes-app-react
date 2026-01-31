import { useState, type Dispatch, type SetStateAction } from "react";
import type { Card } from "../types/Card";

const createCardActions = (
    setOpenedCards: Dispatch<SetStateAction<Card[]>>,
    setSelectedCardId: Dispatch<SetStateAction<number | null>>,
    selectedCardId: number | null,
    openedCards: Card[]
) => ({
    new: (card: Card) => {
        setOpenedCards((prevState) =>
            prevState.find((oldCard) => oldCard.id === card.id)
                ? prevState
                : [...prevState, card]
        );

        setSelectedCardId(card.id);
    },
    close: (cardId: number) => {
        if (cardId === selectedCardId) {
            const currentCardInd = openedCards.findIndex(
                (card) => card.id === cardId
            );

            let newCardId: number | null = null;
            if (openedCards.length > 1) {
                if (currentCardInd > 0)
                    newCardId = openedCards[currentCardInd - 1].id;
                else if (currentCardInd === openedCards.length - 1)
                    newCardId = openedCards[currentCardInd + 1].id;
            }
            setSelectedCardId(newCardId);
        }
        setOpenedCards(openedCards.filter((card) => card.id !== cardId));
    },
    set: (value: SetStateAction<Card[]>) => {
        setOpenedCards(value);
    },
});

export type CardAction = ReturnType<typeof createCardActions>;

export default function useTabs() {
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [openedCards, setOpenedCards] = useState<Card[]>([]);
    const cardActions = createCardActions(
        setOpenedCards,
        setSelectedCardId,
        selectedCardId,
        openedCards
    );

    return { selectedCardId, openedCards, cardActions };
}
