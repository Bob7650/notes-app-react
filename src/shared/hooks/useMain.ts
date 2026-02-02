import { arrayMove } from "@dnd-kit/sortable";
import { useState, type Dispatch, type SetStateAction } from "react";

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
    // FIXME: function works incorrectly when closing tab that is before active tab
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

export type CardAction = ReturnType<typeof createMainActions>;

export default function useMain() {
    const [openedFiles, setOpenedFilesId] = useState<string[]>([]);

    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    const mainActions = createMainActions(
        setOpenedFilesId,
        setSelectedFileId,
        selectedFileId,
        openedFiles,
    );

    return { selectedFileId, openedFiles, mainActions };
}
