import { useContext } from "react";
import IconButton from "../../../shared/components/IconButton";
import { FilesContext } from "../../../shared/context/FilesContext/FilesContext";

export default function DrawerToolBar() {
    const { fileActions } = useContext(FilesContext)!;

    return (
        <div className="top-icons-section">
            <IconButton
                iconName="edit_square"
                onClick={() => {
                    fileActions.add("note");
                }}
            />
            <IconButton
                iconName="create_new_folder"
                onClick={() => {
                    fileActions.add("folder");
                }}
            />
            <IconButton iconName="sort_by_alpha" />
        </div>
    );
}
