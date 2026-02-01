import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { DrawerFile } from "../types/DrawerFile";

const createFileActions = (
    setDrawerItems: Dispatch<SetStateAction<DrawerFile[]>>,
    setLastRemovedId: Dispatch<SetStateAction<string | null>>,
    setFilesContents: Dispatch<
        SetStateAction<
            {
                id: string;
                content: string;
            }[]
        >
    >,
) => ({
    add: (type: "folder" | "note"): void => {
        const defaultFile: DrawerFile = {
            id: String(Date.now()),
            title: type,
            parentId: "root",
            type: type,
        };
        const defaultContent: string = "Start typing here...";

        setDrawerItems((prevState) => [...prevState, defaultFile]);
        setFilesContents((prevState) => [
            ...prevState,
            { id: defaultFile.id, content: defaultContent },
        ]);
    },
    remove: (id: string) => {
        setDrawerItems((prevState) =>
            prevState.filter((item) => item.id !== id),
        );
        setFilesContents((prevState) =>
            prevState.filter((file) => file.id !== id),
        );
        setLastRemovedId(id);
    },
    rename: (id: string, title: string): void => {
        setDrawerItems((prevState) =>
            prevState.map((item) =>
                item.id === id ? { ...item, title: title } : item,
            ),
        );
    },
    updateContent: (id: string, content: string): void => {
        setFilesContents((prevState) =>
            prevState.map((fileContent) =>
                fileContent.id === id
                    ? { ...fileContent, content: content }
                    : fileContent,
            ),
        );
    },
    setParent: (id: string, parentId: string): void => {
        setDrawerItems((prevState) =>
            prevState.map((item) =>
                item.id === id ? { ...item, parentId: parentId } : item,
            ),
        );
    },
});

export function useFiles() {
    const [drawerItems, setDrawerItems] = useState<DrawerFile[]>([]);

    const [filesContents, setFilesContents] = useState<
        { id: string; content: string }[]
    >([]);

    const childrenById = useMemo(() => {
        const map: Map<string, DrawerFile[]> = new Map();

        drawerItems.forEach((item) => {
            const parentId = item.parentId;
            map.set(parentId, [...(map.get(parentId) || []), item]);
        });

        return map;
    }, [drawerItems]);

    const [lastRemovedId, setLastRemovedId] = useState<string | null>(null);

    const fileActions = useMemo(
        () =>
            createFileActions(
                setDrawerItems,
                setLastRemovedId,
                setFilesContents,
            ),
        [],
    );

    const contentById = useMemo(() => {
        const contentById: Record<string, string> = {};

        filesContents.forEach((fileContent) => {
            contentById[fileContent.id] = fileContent.content;
        });

        return contentById;
    }, [filesContents]);

    const titleById = useMemo(() => {
        const titleById: Record<string, string> = {};

        drawerItems.forEach((fileContent) => {
            titleById[fileContent.id] = fileContent.title;
        });

        return titleById;
    }, [drawerItems]);

    return {
        fileActions,
        drawerItems,
        contentById,
        titleById,
        childrenById,
        lastRemovedId,
    };
}
