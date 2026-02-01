import type { ReactNode } from "react";
import { CardsContext } from "./CardsContext";
import useCards from "../../hooks/useMain";

export default function CardsContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const notesState = useCards();

    return (
        <CardsContext.Provider value={notesState}>
            {children}
        </CardsContext.Provider>
    );
}
