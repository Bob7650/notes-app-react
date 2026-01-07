import { useContext, useEffect } from "react";
import { DrawerContext } from "../context/NotesContext/NotesContext";
import { CardsContext } from "../context/TabsContext/CardsContext";

export default function AppController() {
    const { lastRemoved } = useContext(DrawerContext);
    const { cardActions } = useContext(CardsContext);

    useEffect(() => {
        if (!lastRemoved) return;
        cardActions.close(lastRemoved);
    }, [lastRemoved]);

    return null;
}
