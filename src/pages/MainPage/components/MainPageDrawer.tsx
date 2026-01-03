import { useContext } from "react";
import IconButton from "../../../shared/components/IconButton";
import { NotesContext } from "../../../shared/context/NotesContext/NotesContext";
import NoteSelector from "./NoteSelector/NoteSelector";
import { TabsContext } from "../../../shared/context/TabsContext/TabsContext";

export default function MainPageDrawer() {
    const { notes, notesActions } = useContext(NotesContext);
    const { selectedCardId, cardActions } = useContext(TabsContext);

    return (
        <aside className="drawer-section">
            <div className="drawer-top-bar bordered">
                <IconButton iconName="folder" />
                <IconButton iconName="search" />
            </div>
            <div className="drawer-contents bordered">
                <div className="top-icons-section">
                    <IconButton
                        iconName="edit_square"
                        onClick={() => {
                            notesActions.add();
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
                                        cardActions.new(singleNote.id);
                                }}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
