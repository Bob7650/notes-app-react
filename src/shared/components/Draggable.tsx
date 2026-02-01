import { useDraggable } from "@dnd-kit/core";
import type { ReactNode } from "react";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    id: string;
    children: ReactNode;
}

export default function Draggable({ id, children }: Props) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: id,
        });
    //transform: CSS.Translate.toString(transform)
    const style = { opacity: isDragging ? 0.3 : 1 };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    );
}
