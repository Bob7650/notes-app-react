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
