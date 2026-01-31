export type DrawerFolder = {
    id: string;
    title: string;
    parentId: string | "root";
    isExpanded: boolean;
};
