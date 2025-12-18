import IconButton from "../../../shared/components/IconButton";
import NoteSelector from "../../../shared/components/NoteSelector";
import type { NoteObject } from "../../../shared/types/NoteObject";
import type { Rect } from "../../../shared/types/Rect";

interface Props {
    handleAdd: () => void;
    handleRename: (noteId: number, newName: string) => void;
    handleNewTab: (noteId: number) => void;
    handleDisplayPopover: (newAnchor: Rect) => void;
    notesSnapshot: NoteObject[];
    selectedCardId: number | null;
}

export default function MainPageDrawer({
    handleAdd,
    handleRename,
    handleNewTab,
    handleDisplayPopover,
    notesSnapshot,
    selectedCardId,
}: Props) {
    return (
        <aside className="drawer-section">
            <div className="drawer-top-bar bordered">
                <IconButton iconName="folder" />
                <IconButton iconName="search" />
                <IconButton iconName="bookmark" />
            </div>
            <div className="drawer-contents bordered">
                <div className="top-icons-section">
                    <IconButton iconName="edit_square" onClick={handleAdd} />
                    <IconButton iconName="create_new_folder" />
                    <IconButton iconName="sort_by_alpha" />
                </div>
                <ul className="folders-section">
                    {notesSnapshot.map((singleNote) => (
                        <li key={singleNote.id}>
                            <NoteSelector
                                data={singleNote}
                                isSelected={selectedCardId === singleNote.id}
                                onMouseDown={(e) => {
                                    if (e.button === 0)
                                        handleNewTab(singleNote.id);
                                    else if (e.button === 2) {
                                        handleDisplayPopover({
                                            x: e.clientX,
                                            y: e.clientY,
                                            width: 0,
                                            height: 0,
                                        });
                                        e.stopPropagation();
                                    }
                                    console.log(e.button);
                                }}
                                onRename={handleRename}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
