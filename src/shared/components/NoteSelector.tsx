import "./NoteSelector.style.css";

interface Props {
    depth: number;
    isSelected?: boolean;
    isActive?: boolean;
}

export default function NoteSelector({ depth, isActive, isSelected }: Props) {
    return (
        <div
            className={`note-selector-wrapper${isActive ? " note-active" : ""}${
                isSelected ? " note-selected" : ""
            }`}
        >
            {[...Array(depth)].map(() => (
                <span className="indent-bar">|</span>
            ))}
            <span className="editable-label">Note Title</span>
        </div>
    );
}
