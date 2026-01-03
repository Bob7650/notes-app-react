import { createContext, type SetStateAction } from "react";

export const TabsContext = createContext<{
    selectedCardId: number | null;
    openedCards: number[];
    cardActions: {
        new: (cardId: number) => void;
        close: (cardId: number) => void;
        set: (value: SetStateAction<number[]>) => void;
    };
}>({
    selectedCardId: null,
    openedCards: [],
    cardActions: { new: () => {}, close: () => {}, set: () => {} },
});
