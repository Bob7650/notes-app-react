import { type ReactNode } from "react";
import { useFiles } from "../../hooks/useFiles";
import { FilesContext } from "./FilesContext";

export default function FilesContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const drawerState = useFiles();

    return (
        <FilesContext.Provider value={drawerState}>
            {children}
        </FilesContext.Provider>
    );
}
