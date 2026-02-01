import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { DrawerFile } from "../types/DrawerFile";
import type { DrawerFolder } from "../types/DrawerFolder";

const createSharedActions = (
    setDrawerItems: Dispatch<SetStateAction<(DrawerFile | DrawerFolder)[]>>,
    setEditableId: Dispatch<SetStateAction<string | null>>,
) => ({
    add: (type: "folder" | "note"): void => {
        const defaultFolder: DrawerFolder = {
            id: String(Date.now()),
            title: type,
            parentId: "root",
            isExpanded: false,
        };

        const defaultFile: DrawerFile = {
            id: String(Date.now()),
            title: type,
            parentId: "root",
        };

        setDrawerItems((prevState) => [
            ...prevState,
            type === "folder" ? defaultFolder : defaultFile,
        ]);
    },
    removeById: (id: string) => {
        setDrawerItems((prevState) =>
            prevState.filter((item) => item.id !== id),
        );
        //setLastRemoved(id);
    },
    renameById: (id: string, title: string): void => {
        setDrawerItems((prevState) =>
            prevState.map((item) =>
                item.id === id ? { ...item, title: title } : item,
            ),
        );
    },
    makeEditable: (id: string) => {
        setEditableId(id);
    },
    makeStatic: () => {
        setEditableId(null);
    },
});

const createFolderActions = (
    setDrawerItems: Dispatch<SetStateAction<(DrawerFile | DrawerFolder)[]>>,
) => ({
    expandFolder: (id: string): void => {
        setDrawerItems((prevState) =>
            prevState.map((item) =>
                item.id === id && "isExpanded" in item
                    ? { ...item, isExpanded: !item.isExpanded }
                    : item,
            ),
        );
    },
});

const createPopoverActions = (
    sharedActions: ReturnType<typeof createSharedActions>,
) => ({
    removeById: (id: string): void => {
        sharedActions.removeById(id);
    },
    copy: (): void => {
        // TODO: implement
    },
    makeEditable: (id: string): void => {
        sharedActions.makeEditable(id);
    },
});

export type DrawerAction = ReturnType<typeof createSharedActions>;

export function useDrawer() {
    const [drawerItems, setDrawerItems] = useState<
        (DrawerFile | DrawerFolder)[]
    >([]);

    const childrenById = useMemo(() => {
        const map: Map<string, (DrawerFile | DrawerFolder)[]> = new Map();

        drawerItems.forEach((item) => {
            const parentId = item.parentId;
            map.set(parentId, [...(map.get(parentId) || []), item]);
        });

        return map;
    }, [drawerItems]);

    //const [lastRemovedId, setLastRemovedId] = useState<number | null>(null);
    const [renamingId, setRenamingId] = useState<string | null>(null);

    const sharedActions = useMemo(
        () => createSharedActions(setDrawerItems, setRenamingId),
        [],
    );

    const folderActions = useMemo(
        () => createFolderActions(setDrawerItems),
        [],
    );

    const popoverActions = useMemo(
        () => createPopoverActions(sharedActions),
        [],
    );

    return {
        sharedActions,
        folderActions,
        popoverActions,
        childrenById,
        renamingId,
    };
}
