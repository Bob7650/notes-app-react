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
    // ERR: function does not respect children of other folders
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
                    (item) => item.type === "note",
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
    dropFileToFolder: (fileId: string, folderId: string): void => {
        setDrawerItems((prevState) => {
            const prevStateCopy = prevState.slice();

            const { startInd, endInd } = getSubtreeRange(prevStateCopy, fileId);

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

            const depthDelta = folderFile.depth + 1 - subtreeItems[0].depth;
            subtreeItems = subtreeItems.map((item) => ({
                ...item,
                depth: item.depth + depthDelta,
            }));

            const folderInd = prevStateCopy.indexOf(folderFile);
            prevStateCopy.splice(folderInd + 1, 0, ...subtreeItems);

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
    const [drawerItems, setDrawerItems] = useState<DrawerFile[]>([]);

    const [filesContents, setFilesContents] = useState<
        { id: string; content: string }[]
    >([]);

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

export function getSubtreeRange(
    files: DrawerFile[],
    rootId: string,
): { startInd: number; endInd: number } {
    const rootFile = files.find((item) => item.id === rootId);
    if (!rootFile) return { startInd: 0, endInd: 0 };

    const rootDepth = rootFile.depth;
    const startInd = files.indexOf(rootFile);

    let endInd = startInd;
    while (++endInd < files.length && files[endInd].depth > rootDepth);
    endInd--;

    return { startInd: startInd, endInd: endInd };
}
