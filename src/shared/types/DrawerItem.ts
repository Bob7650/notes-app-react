export type DrawerItem = {
    id: number;
    title: string;
    parentId: number | "root";
    isFolder: boolean;
    isExpanded?: boolean;
    content?: string;
};
