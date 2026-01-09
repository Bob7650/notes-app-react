export type DrawerItem = {
    id: number;
    title: string;
    parentId: number | "root";
    isFolder: boolean;
    content?: string;
};
