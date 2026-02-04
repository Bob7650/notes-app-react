import type { DrawerFile } from "../types/DrawerFile";

export function getFolderSubtreeRange(
    folderId: string,
    filesList: DrawerFile[],
): { startInd: number; endInd: number } {
    let rootFolder = filesList.find((item) => item.id === folderId);
    if (!rootFolder) return { startInd: 0, endInd: 0 };

    const rootDepth = rootFolder.depth;
    const startInd = filesList.indexOf(rootFolder);

    let endInd = startInd;
    while (++endInd < filesList.length && filesList[endInd].depth > rootDepth);
    endInd--;

    return { startInd: startInd, endInd: endInd };
}

/**
 * Finds the parent folder of passed note or folder.
 * @param fileId child id
 * @param filesList file list
 * @returns DrawerFile object of the parent folder, DrawerFile object with id: "root" when note in the root directory, null when the passed file does not exist
 */
export function findFolderOf(
    fileId: string,
    filesList: DrawerFile[],
): DrawerFile | null {
    const file = filesList.find((item) => fileId === item.id);
    if (!file) return null;

    const fileInd = filesList.indexOf(file);

    let folderInd = fileInd;
    while (--folderInd >= 0) {
        if (
            filesList[folderInd].type === "folder" &&
            filesList[folderInd].depth === file.depth - 1
        ) {
            break;
        }
    }

    if (folderInd === -1)
        return { id: "root", title: "root", depth: -1, type: "folder" };
    return filesList[folderInd];
}
