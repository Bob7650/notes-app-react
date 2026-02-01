import { useContext, useEffect } from "react";
import { DrawerContext } from "../context/DrawerContext/DrawerContext";
import { MainPanelContext } from "../context/MainPanelContext/MainPanelContext";

export default function AppController() {
    const { lastRemovedId } = useContext(DrawerContext)!;
    const { cardActions } = useContext(MainPanelContext)!;

    useEffect(() => {
        if (!lastRemovedId) return;
        cardActions.close(lastRemovedId);
    }, [lastRemovedId]);

    return null;
}
