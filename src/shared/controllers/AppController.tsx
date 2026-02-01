import { useContext, useEffect } from "react";
import { MainPanelContext } from "../context/MainPanelContext/MainPanelContext";
import { FilesContext } from "../context/FilesContext/FilesContext";

export default function AppController() {
    const { lastRemovedId } = useContext(FilesContext)!;
    const { mainActions } = useContext(MainPanelContext)!;

    /**
     * Close tab associated with a note when the note is removed
     */
    useEffect(() => {
        if (!lastRemovedId) return;
        mainActions.closeNote(lastRemovedId);
    }, [lastRemovedId]);

    return null;
}
