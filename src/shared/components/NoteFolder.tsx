import "./NoteFolder.style.css";

interface Props {
    isActive?: boolean;
    isSelected?: boolean;
}

export default function NoteFolder({ isActive, isSelected }: Props) {
    return (
        <div
            className={`note-folder-wrapper${isActive ? " note-active" : ""}${
                isSelected ? " note-selected" : ""
            }`}
        >
            <span className="material-symbols-outlined">
                keyboard_arrow_right
            </span>
            <span className="editable-label">Folder Name</span>
        </div>
    );
}
