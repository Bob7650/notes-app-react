import { useContext, useEffect } from "react";
import { MainPanelContext } from "../context/MainPanelContext/MainPanelContext";
import { FilesContext } from "../context/FilesContext/FilesContext";

export default function AppController() {
    const { lastRemovedIds } = useContext(FilesContext)!;
    const { mainActions } = useContext(MainPanelContext)!;

    useEffect(() => {
        lastRemovedIds.forEach((id) => mainActions.closeNote(id));
    }, [lastRemovedIds]);

    return null;
}
