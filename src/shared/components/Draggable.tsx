import { useDraggable } from "@dnd-kit/core";
import type { ReactNode } from "react";

interface Props {
    id: string;
    children: ReactNode;
}

export default function Draggable({ id, children }: Props) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: id,
    });
    const style = { opacity: isDragging ? 0.3 : 1 };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    );
}
