import { createContext } from "react";
import type { CardAction } from "../../hooks/useCards";
import type { Card } from "../../types/Card";

type CardContextValue = {
    selectedCardId: number | null;
    openedCards: Card[];
    cardActions: CardAction;
};

export const CardsContext = createContext<CardContextValue | null>(null);
