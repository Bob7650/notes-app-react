import {
    useEffect,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import type { DrawerItem } from "../types/DrawerItem";

const DRAWER_ITEMS_STORAGE_ID = "drawer_items";

const createDrawerActions = (
    setDrawerItems: Dispatch<SetStateAction<DrawerItem[]>>,
    setLastRemoved: Dispatch<SetStateAction<number | null>>,
    setRenamingId: Dispatch<SetStateAction<number | null>>
) => ({
    addItem: (type: "folder" | "note"): void => {
        setDrawerItems((prevState) => [
            ...prevState,
            {
                id: Date.now(),
                title: type,
                parentId: "root",
                isFolder: type === "folder",
                content: type === "note" ? "" : undefined,
            },
        ]);
    },
    updateNoteContent: (noteId: number | null, content: string): void => {
        setDrawerItems((prevState) =>
            prevState.map((note) =>
                note.id === noteId && !note.isFolder
                    ? {
                          ...note,
                          content: content,
                      }
                    : note
            )
        );
    },
    addFolderChild: (folderId: number, noteId: number): void => {
        // TODO: implement function
    },
    setFolderChildren: (folderId: number, noteId: number): void => {
        // TODO: implement function
    },
    removeEntry: (id: number) => {
        setDrawerItems((prevState) =>
            prevState.filter((item) => item.id !== id)
        );
        // Instead of this can send event, maybe chackout in the future
        setLastRemoved(id);
    },
    setEntryRenaming: (id: number) => {
        setRenamingId(id);
    },
    cancelEntryRenaming: () => {
        setRenamingId(null);
    },
    renameEntry: (id: number, title: string): void => {
        setDrawerItems((prevState) =>
            prevState.map((item) =>
                item.id === id ? { ...item, title: title } : item
            )
        );
    },
});

export type DrawerAction = ReturnType<typeof createDrawerActions>;

export function useDrawer() {
    const initialItemsState = (): DrawerItem[] => {
        const savedItems = localStorage.getItem(DRAWER_ITEMS_STORAGE_ID);
        try {
            return JSON.parse(savedItems ?? "[]");
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const [drawerItems, setDrawerItems] =
        useState<DrawerItem[]>(initialItemsState);

    const [lastRemovedId, setLastRemovedId] = useState<number | null>(null);
    const [renamingId, setRenamingId] = useState<number | null>(null);

    const drawerActions = useMemo(
        () =>
            createDrawerActions(
                setDrawerItems,
                setLastRemovedId,
                setRenamingId
            ),
        []
    );

    const contentById = useMemo(() => {
        const record: Record<number, string> = {};

        drawerItems.forEach((item) => {
            if (item.content) record[item.id] = item.content;
        });

        return record;
    }, [drawerItems]);

    const drawerItemsById = useMemo(() => {
        const record: Record<number, DrawerItem> = {};

        drawerItems.forEach((item) => {
            record[item.id] = item;
        });

        return record;
    }, [drawerItems]);

    const drawerMap = useMemo(() => {
        const map: Map<number | "root", DrawerItem[]> = new Map();

        drawerItems.forEach((item) => {
            const key = item.parentId;
            map.set(key, [...(map.get(key) || []), item]);
        });

        return map;
    }, [drawerItems]);

    useEffect(() => {
        localStorage.setItem(
            DRAWER_ITEMS_STORAGE_ID,
            JSON.stringify(drawerItems)
        );
    }, [drawerItems]);

    return {
        drawerMap,
        contentById,
        drawerItemsById,
        drawerActions,
        lastRemovedId,
        renamingId,
    };
}
