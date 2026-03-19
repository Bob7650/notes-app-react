import type { DrawerFile } from "../types/DrawerFile";

export function getFileSpan(
    file: DrawerFile,
    filesList: DrawerFile[],
): { startInd: number; endInd: number } {
    // if (file.id === "root")
    //     return { startInd: 0, endInd: filesList.length - 1 };

    if (file.type === "note") {
        const fileInd = filesList.indexOf(file);
        return { startInd: fileInd, endInd: fileInd };
    }

    const rootDepth = file.depth;
    const startInd = filesList.indexOf(file);

    let endInd = startInd;
    while (++endInd < filesList.length && filesList[endInd].depth > rootDepth);
    endInd--;

    return { startInd: startInd, endInd: endInd };
}

export function getParentFolderOf(
    file: DrawerFile,
    filesList: DrawerFile[],
): DrawerFile {
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

    return filesList[folderInd];
}

export function getIdsInRange(
    startInd: number,
    endInd: number,
    fileList: DrawerFile[],
): string[] {
    const idList: string[] = [];
    for (let i = startInd; i <= endInd; i++) {
        idList.push(fileList[i].id);
    }

    return idList;
}

export function getValidDrops(
    fileId: string,
    fileList: DrawerFile[],
): DrawerFile[] {
    const file = fileList.find((item) => item.id === fileId);
    if (!file) {
        console.error(
            "FolderTreeUtils#getValidDrops()",
            "Item does not exist!",
        );
        return [];
    }

    const invalidDrops: DrawerFile[] = [];

    if (file.type === "folder") {
        const { startInd, endInd } = getFileSpan(file, fileList);
        for (let i = startInd; i <= endInd; i++) {
            invalidDrops.push(fileList[i]);
        }
    }

    const folder = getParentFolderOf(file, fileList);
    const { startInd, endInd } = getFileSpan(folder, fileList);
    invalidDrops.push(folder);

    for (let i = startInd + 1; i <= endInd; i++) {
        if (fileList[i].type === "note" && fileList[i].depth === file.depth)
            invalidDrops.push(fileList[i]);
    }

    const validDrops = fileList.filter((elem) => !invalidDrops.includes(elem));
    console.log(validDrops.map((it) => it.id));
    return validDrops;
}
