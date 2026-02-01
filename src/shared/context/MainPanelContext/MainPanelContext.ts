import { createContext } from "react";
import type useMain from "../../hooks/useMain";

type MainPanelContextValue = ReturnType<typeof useMain>;

export const MainPanelContext = createContext<MainPanelContextValue | null>(
    null,
);
