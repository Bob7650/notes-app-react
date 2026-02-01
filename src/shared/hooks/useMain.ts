import { useMemo, useState, type Dispatch, type SetStateAction } from "react";

const createMainActions = (
    setOpenedFilesId: Dispatch<SetStateAction<string[]>>,
    setSelectedFileId: Dispatch<SetStateAction<string | null>>,
    setFilesContents: Dispatch<
        SetStateAction<
            {
                id: string;
                content: string;
            }[]
        >
    >,
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
    updateContent: (id: string, content: string): void => {
        setFilesContents((prevState) =>
            prevState.map((fileContent) =>
                fileContent.id === id
                    ? { ...fileContent, content: content }
                    : fileContent,
            ),
        );
    },
});

export type CardAction = ReturnType<typeof createMainActions>;

export default function useMain() {
    const [openedFiles, setOpenedFilesId] = useState<string[]>([]);
    const [filesContents, setFilesContents] = useState<
        { id: string; content: string }[]
    >([]);

    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    const contentById = useMemo(() => {
        const contentById: Record<string, string> = {};

        filesContents.forEach((fileContent) => {
            contentById[fileContent.id] = fileContent.content;
        });

        return contentById;
    }, [filesContents]);

    const mainActions = createMainActions(
        setOpenedFilesId,
        setSelectedFileId,
        setFilesContents,
        selectedFileId,
        openedFiles,
    );

    return { selectedFileId, openedFiles, contentById, mainActions };
}
