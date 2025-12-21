import IconButton from "../../../shared/components/IconButton";
import NoteSelector from "./NoteSelector/NoteSelector";
import { useContext } from "react";
import { NotesContext } from "../../../shared/context/NotesContext";

interface Props {
    handleNewTab: (noteId: number) => void;
    selectedCardId: number | null;
}

export default function MainPageDrawer({
    handleNewTab,
    selectedCardId,
}: Props) {
    const [notes, dispatch] = useContext(NotesContext);

    return (
        <aside className="drawer-section">
            <div className="drawer-top-bar bordered">
                <IconButton iconName="folder" />
                <IconButton iconName="search" />
                <IconButton iconName="bookmark" />
            </div>
            <div className="drawer-contents bordered">
                <div className="top-icons-section">
                    <IconButton
                        iconName="edit_square"
                        onClick={() => {
                            dispatch({ type: "ADD" });
                        }}
                    />
                    <IconButton iconName="create_new_folder" />
                    <IconButton iconName="sort_by_alpha" />
                </div>
                <ul className="folders-section">
                    {notes.map((singleNote) => (
                        <li key={singleNote.id}>
                            <NoteSelector
                                data={singleNote}
                                isSelected={selectedCardId === singleNote.id}
                                onMouseDown={(e) => {
                                    if (e.button === 0)
                                        handleNewTab(singleNote.id);
                                }}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
