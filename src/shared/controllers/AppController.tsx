import { useContext, useEffect } from "react";
import { DrawerContext } from "../context/NotesContext/NotesContext";
import { CardsContext } from "../context/TabsContext/CardsContext";

export default function AppController() {
    const { lastRemovedId } = useContext(DrawerContext)!;
    const { cardActions } = useContext(CardsContext)!;

    useEffect(() => {
        if (!lastRemovedId) return;
        cardActions.close(lastRemovedId);
    }, [lastRemovedId]);

    return null;
}
