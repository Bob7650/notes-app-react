import { type ReactNode } from "react";
import { DrawerContext } from "./NotesContext";
import { useDrawer } from "../../hooks/useDrawer";

export default function NotesContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const notesState = useDrawer();

    return (
        <DrawerContext.Provider value={notesState}>
            {children}
        </DrawerContext.Provider>
    );
}
