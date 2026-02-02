/**
 * Loads list of data of defined type from local storage, and returns its value.
 * @param STORAGE_KEY key name that would be passed to getItem function of localStorage interface
 * @returns list of data of defined type, or an empty list when data does not exist, or is not a valid json.
 */
export function getFromLocalStorage<type>(STORAGE_KEY: string): type[] {
    const openedFilesStr = localStorage.getItem(STORAGE_KEY);
    if (!openedFilesStr) return [];
    let openedFilesPar = [];
    try {
        openedFilesPar = JSON.parse(openedFilesStr);
    } catch (error) {
        console.error(`JSON parse error: ${error}`);
    } finally {
        return openedFilesPar;
    }
}

export function saveToLocalStorage(STORAGE_KEY: string, data: any) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
