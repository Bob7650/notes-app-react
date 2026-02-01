import { type ReactNode } from "react";
import { DrawerContext } from "./DrawerContext";
import { useDrawer } from "../../hooks/useDrawer";

export default function DrawerContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const drawerState = useDrawer();

    return (
        <DrawerContext.Provider value={drawerState}>
            {children}
        </DrawerContext.Provider>
    );
}
