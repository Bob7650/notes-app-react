import IconButton from "./IconButton";
import "./NoteCard.style.css";

interface Props {
    isSelected?: boolean;
}

export default function NoteCard({ isSelected }: Props) {
    return (
        <div className={`card-wrapper${isSelected ? " card-selected" : ""}`}>
            <span className="card-title">Note Title</span>
            <IconButton iconName="close" />
        </div>
    );
}
