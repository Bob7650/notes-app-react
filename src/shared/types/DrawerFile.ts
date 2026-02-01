export type DrawerFile = {
    id: string;
    title: string;
    parentId: string | "root";
    type: "folder" | "note";
};
