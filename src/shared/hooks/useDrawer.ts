import { useMemo, useState, type Dispatch, type SetStateAction } from "react";

const createDrawerActions = (
    setEditableId: Dispatch<SetStateAction<string | null>>,
    setExpandedId: Dispatch<SetStateAction<string[]>>,
) => ({
    makeEditable: (id: string) => {
        setEditableId(id);
    },
    makeAllStatic: () => {
        setEditableId(null);
    },
    expandFolder: (id: string): void => {
        setExpandedId((prevState) =>
            prevState.find((expandedId) => expandedId === id)
                ? prevState.filter((expId) => expId !== id)
                : [...prevState, id],
        );
    },
});

export type DrawerAction = ReturnType<typeof createDrawerActions>;

export function useDrawer() {
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string[]>([]);

    const drawerActions = useMemo(
        () => createDrawerActions(setRenamingId, setExpandedId),
        [],
    );

    return {
        drawerActions,
        expandedId,
        renamingId,
    };
}
