import { useDraggable } from "@dnd-kit/core";
import type { ReactNode } from "react";

interface Props {
    id: string;
    canDrag: boolean;
    children: ReactNode;
}

export default function Draggable({ id, canDrag, children }: Props) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: id,
        disabled: !canDrag,
    });
    const style = { opacity: isDragging ? 0.3 : 1 };
    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    );
}
