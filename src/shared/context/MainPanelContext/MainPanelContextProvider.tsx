import type { ReactNode } from "react";
import { MainPanelContext } from "./MainPanelContext";
import useMain from "../../hooks/useMain";

export default function MainPanelContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const mainPanelState = useMain();

    return (
        <MainPanelContext.Provider value={mainPanelState}>
            {children}
        </MainPanelContext.Provider>
    );
}
