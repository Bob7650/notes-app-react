import { useContext, useEffect } from "react";
import { NotesContext } from "../context/NotesContext/NotesContext";
import { TabsContext } from "../context/TabsContext/TabsContext";

export default function AppController() {
    const { lastRemoved } = useContext(NotesContext);
    const { cardActions } = useContext(TabsContext);

    useEffect(() => {
        if (!lastRemoved) return;
        cardActions.close(lastRemoved);
    }, [lastRemoved]);

    return null;
}
