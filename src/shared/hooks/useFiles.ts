import {
    useEffect,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import type { DrawerFile } from "../types/DrawerFile";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/StorageUtils";
import {
    getFileSpan,
    getValidDrops,
} from "../utils/FolderTreeUtils";

const DRAWER_ITEMS_KEY = "drawer_items";
const FILES_CONTENTS_KEY = "files_contents";

const createFileActions = (
    setDrawerItems: Dispatch<SetStateAction<DrawerFile[]>>,
    setLastRemovedIds: Dispatch<SetStateAction<string[]>>,
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
    remove: (id: string) => {
        setDrawerItems((prevState) => {
            const itemToRemove = prevState.find((item) => item.id === id);
            if (!itemToRemove) return prevState;
            if (itemToRemove.type === "folder") {
                const prevStateCopy = prevState.slice();
                const { startInd, endInd } = getFileSpan(
                    itemToRemove,
                    prevStateCopy,
                );
                setLastRemovedIds(prevStateCopy.splice(startInd, endInd - startInd + 1).map((item) => item.id));
                console.log(
                    `Removing from: ${startInd} amount: ${endInd - startInd + 1}`,
                );
                return prevStateCopy;
            }
            return prevState.filter((item) => item.id !== id);
        });
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

            const file = prevStateCopy.find((item) => item.id === fileId);
            if (!file) {
                console.error(
                    "useFiles#dropFileToFolder()",
                    "File does note exist!",
                );
                return prevState;
            }

            const folder = prevStateCopy.find((item) => item.id === folderId);
            if (!folder) {
                console.error(
                    "useFiles#dropFileToFolder()",
                    "Folder does note exist!",
                );
                return prevState;
            }

            if (folder.type !== "folder") {
                console.error(
                    "useFiles#dropFileToFolder()",
                    "Folder is a note!",
                );
                return prevState;
            }

            const validDrops = getValidDrops(fileId, prevStateCopy);

            if (!validDrops.includes(folder)) {
                console.error("useFiles#dropFileToFolder()", "Invalid drop!");
                return prevState;
            }

            const { startInd, endInd } = getFileSpan(file, prevStateCopy);

            const subtreeItems = prevStateCopy.splice(
                startInd,
                endInd - startInd + 1,
            );

            const normalizedSubtreeItems = subtreeItems.map((item) => ({
                ...item,
                depth: item.depth - file.depth,
            }));

            const adjustedSubtreeItems = normalizedSubtreeItems.map(item => ({
                ...item,
                depth: item.depth + folder.depth + 1
            }));

            let insertInd = prevStateCopy.indexOf(folder);
            ++insertInd;

            if (file.type === "note") {
                // TODO: change this to for loop with getFileSpan() for readablility
                while (insertInd !== prevStateCopy.length &&
                    prevStateCopy[insertInd].depth >= adjustedSubtreeItems[0].depth) {
                    if (prevStateCopy[insertInd].type === "note" &&
                    prevStateCopy[insertInd].depth === adjustedSubtreeItems[0].depth) {
                        break;
                    } else {
                        ++insertInd;
                    }
                }
            }

            prevStateCopy.splice(insertInd, 0, ...adjustedSubtreeItems);

            console.log(
                "fileActions#dropFileToFolder()\n",
                `StartInd: ${startInd},\n` +
                    `EndInd: ${endInd},\n` +
                    `depthOfRoot: ${adjustedSubtreeItems[0].depth}`,
            );
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

    const [lastRemovedIds, setLastRemovedIds] = useState<string[]>([]);

    useEffect(() => {
        saveToLocalStorage(DRAWER_ITEMS_KEY, drawerItems);
    }, [drawerItems]);

    useEffect(() => {
        localStorage.setItem(FILES_CONTENTS_KEY, JSON.stringify(filesContents));
    }, [filesContents]);

    useEffect(()=>{
        setFilesContents((prevState) => prevState.filter((item) => !lastRemovedIds.includes(item.id)))
    }, [lastRemovedIds]);

    const fileActions = useMemo(
        () =>
            createFileActions(
                setDrawerItems,
                setLastRemovedIds,
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
        lastRemovedIds,
    };
}
