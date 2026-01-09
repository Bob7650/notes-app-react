import { createContext } from "react";
import type { useDrawer } from "../../hooks/useDrawer";

export type DrawerContextValue = ReturnType<typeof useDrawer>;

export const DrawerContext = createContext<DrawerContextValue | null>(null);
