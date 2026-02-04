import {
    useEffect,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import type { DrawerFile } from "../types/DrawerFile";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/StorageUtils";
import { getFolderSubtreeRange } from "../utils/FolderTreeUtils";

const DRAWER_ITEMS_KEY = "drawer_items";
const FILES_CONTENTS_KEY = "files_contents";

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
            depth: 0,
            type: type,
        };

        if (type === "note") {
            const defaultContent = {
                id: defaultFile.id,
                content: "Start typing here...",
            };

            setDrawerItems((prevState) => [...prevState, defaultFile]);
            setFilesContents((prevState) => [...prevState, defaultContent]);
            return;
        }
        if (type === "folder") {
            setDrawerItems((prevState) => {
                let firstNoteInd = prevState.findIndex(
                    (item) => item.type === "note" && item.depth === 0,
                );

                if (firstNoteInd === -1) firstNoteInd = prevState.length;

                const newArr = prevState.slice();
                newArr.splice(firstNoteInd, 0, defaultFile);
                return newArr;
            });
            return;
        }
    },
    // FIXME: when removing a folder, children files not closing
    remove: (id: string) => {
        setDrawerItems((prevState) => {
            const itemToRemove = prevState.find((item) => item.id === id);
            if (!itemToRemove) return prevState;
            if (itemToRemove.type === "folder") {
                const prevStateCopy = prevState.slice();
                const { startInd, endInd } = getFolderSubtreeRange(
                    itemToRemove.id,
                    prevStateCopy,
                );
                prevStateCopy.splice(startInd, endInd - startInd + 1);
                console.log(
                    `Removing from: ${startInd} amount: ${endInd - startInd + 1}`,
                );
                return prevStateCopy;
            }
            return prevState.filter((item) => item.id !== id);
        });
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
    dropFileToFolder: (fileId: string, folderId: string): void => {
        setDrawerItems((prevState) => {
            const prevStateCopy = prevState.slice();

            const { startInd, endInd } = getFolderSubtreeRange(
                fileId,
                prevStateCopy,
            );

            let subtreeItems = prevStateCopy.splice(
                startInd,
                endInd - startInd + 1,
            );

            const folderFile = prevStateCopy.find(
                (item) => item.id === folderId,
            );

            if (!folderFile) {
                console.error(
                    "fileActions#dropFileToFolder()",
                    "Folder does not exist or trying to drop into child folder!",
                );
                return prevState;
            }

            // HACK: this is temporary
            if (folderFile.type === "note") return prevState;

            const depthDelta = folderFile.depth + 1 - subtreeItems[0].depth;
            subtreeItems = subtreeItems.map((item) => ({
                ...item,
                depth: item.depth + depthDelta,
            }));

            let insertInd = prevStateCopy.indexOf(folderFile);
            ++insertInd;

            if (subtreeItems[0].type === "note") {
                while (
                    insertInd !== prevStateCopy.length &&
                    prevStateCopy[insertInd].depth >= subtreeItems[0].depth
                ) {
                    if (
                        prevStateCopy[insertInd].type === "note" &&
                        prevStateCopy[insertInd].depth === subtreeItems[0].depth
                    ) {
                        break;
                    } else {
                        ++insertInd;
                    }
                }
            }

            prevStateCopy.splice(insertInd, 0, ...subtreeItems);

            // console.log(
            //     "fileActions#dropFileToFolder()\n",
            //     `StartInd: ${startInd},\n` +
            //         `EndInd: ${endInd},\n` +
            //         `FolderInd: ${folderInd},\n` +
            //         `depthOfRoot: ${subtreeItems[0].depth}`,
            // );
            return prevStateCopy;
        });
    },
});

export function useFiles() {
    // save this
    const [drawerItems, setDrawerItems] = useState<DrawerFile[]>(
        getFromLocalStorage<DrawerFile>(DRAWER_ITEMS_KEY),
    );
    const [filesContents, setFilesContents] = useState<
        { id: string; content: string }[]
    >(getFromLocalStorage<{ id: string; content: string }>(FILES_CONTENTS_KEY));

    useEffect(() => {
        saveToLocalStorage(DRAWER_ITEMS_KEY, drawerItems);
    }, [drawerItems]);

    useEffect(() => {
        localStorage.setItem(FILES_CONTENTS_KEY, JSON.stringify(filesContents));
    }, [filesContents]);

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
        lastRemovedId,
    };
}
