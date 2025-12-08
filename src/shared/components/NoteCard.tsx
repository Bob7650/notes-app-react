import IconButton from "./IconButton";
import "./NoteCard.style.css";

interface Props {
    title: string;
    onClick?: () => void;
    onClose?: () => void;
    isSelected?: boolean;
}

export default function NoteCard({
    isSelected,
    onClick,
    onClose,
    title,
}: Props) {
    return (
        <div
            className={`card-wrapper${isSelected ? " card-selected" : ""}`}
            onClick={onClick}
        >
            <span className="card-title">{title}</span>
            <IconButton iconName="close" onClick={onClose} />
        </div>
    );
}
