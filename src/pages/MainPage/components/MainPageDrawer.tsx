import { useContext } from "react";
import IconButton from "../../../shared/components/IconButton";
import { NotesContext } from "../../../shared/context/NotesContext";
import NoteSelector from "./NoteSelector/NoteSelector";

interface Props {
    cardActions: {
        new: (cardId: number) => void;
        close: (cardId: number) => void;
    };
    selectedCardId: number | null;
}

export default function MainPageDrawer({ cardActions, selectedCardId }: Props) {
    //const [notes, dispatch] = useContext(NotesContext);
    const { notes, notesActions } = useContext(NotesContext);

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
                            //dispatch({ type: "ADD" });
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
                                onDelete={() => {
                                    cardActions.close(singleNote.id);
                                }}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
