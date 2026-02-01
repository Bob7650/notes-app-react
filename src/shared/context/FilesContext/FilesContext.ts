import { createContext } from "react";
import type { useFiles } from "../../hooks/useFiles";

export type FilesContextValue = ReturnType<typeof useFiles>;

export const FilesContext = createContext<FilesContextValue | null>(null);
