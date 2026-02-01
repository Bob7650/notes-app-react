import { useSortable } from "@dnd-kit/sortable";
import IconButton from "../../../../shared/components/IconButton";
import "./NoteCard.style.css";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    id: string;
    title: string | undefined;
    isSelected?: boolean;
    onClick?: () => void;
    onClose?: () => void;
}

export default function NoteCard({
    isSelected,
    onClick,
    onClose,
    title,
    id,
}: Props) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };
    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`card-wrapper${isSelected ? " card-selected" : ""}`}
            onMouseDown={(e) => {
                if (e.button === 1) {
                    onClose?.();
                } else {
                    onClick?.();
                }
            }}
            {...listeners}
            {...attributes}
        >
            <span className="card-title">{title}</span>
            <IconButton iconName="close" onClick={onClose} />
        </div>
    );
}
