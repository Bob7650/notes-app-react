import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/StorageUtils";

export type CardAction = ReturnType<typeof createMainActions>;

const OPENED_FILES_KEY = "opened_files";

const createMainActions = (
    setOpenedFilesId: Dispatch<SetStateAction<string[]>>,
    setSelectedFileId: Dispatch<SetStateAction<string | null>>,
    selectedFileId: string | null,
    openedFiles: string[],
) => ({
    reverse: (): void => {
        // TODO: implement
    },
    forward: (): void => {
        // TODO: implement
    },
    openNote: (fileId: string) => {
        setOpenedFilesId((prevState) =>
            prevState.find((openedId) => openedId === fileId)
                ? prevState
                : [...prevState, fileId],
        );

        setSelectedFileId(fileId);
    },
    closeNote: (fileId: string): void => {
        if (fileId === selectedFileId) {
            const currentCardInd = openedFiles.findIndex(
                (openedId) => openedId === fileId,
            );

            let newSelected: string | null = null;
            if (openedFiles.length > 1) {
                if (currentCardInd > 0)
                    newSelected = openedFiles[currentCardInd - 1];
                else if (currentCardInd === openedFiles.length - 1)
                    newSelected = openedFiles[currentCardInd + 1];
            }
            setSelectedFileId(newSelected);
        }
        setOpenedFilesId((prevState) =>
            prevState.filter((openedId) => openedId !== fileId),
        );
    },
    swapTabsPosition: (fileIdA: string, fileIdB: string): void => {
        setOpenedFilesId((prevState) => {
            const oldIndex = prevState.findIndex(
                (fileId) => fileId === fileIdA,
            );
            const newIndex = prevState.findIndex(
                (fileId) => fileId === fileIdB,
            );

            return arrayMove(prevState, oldIndex, newIndex);
        });
    },
});

export default function useMain() {
    // save this
    const [openedFiles, setOpenedFilesId] = useState<string[]>(
        getFromLocalStorage<string>(OPENED_FILES_KEY),
    );

    useEffect(() => {
        saveToLocalStorage(OPENED_FILES_KEY, openedFiles);
    }, [openedFiles]);

    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    const mainActions = createMainActions(
        setOpenedFilesId,
        setSelectedFileId,
        selectedFileId,
        openedFiles,
    );

    return { selectedFileId, openedFiles, mainActions };
}
