import type { ReactNode } from "react";
import { TabsContext } from "./TabsContext";
import useTabs from "../../hooks/useTabs";

export default function TabsContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const notesState = useTabs();

    return (
        <TabsContext.Provider value={notesState}>
            {children}
        </TabsContext.Provider>
    );
}
