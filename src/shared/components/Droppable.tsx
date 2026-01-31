import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

interface Props {
    id: number;
    children: ReactNode;
}

export default function Droppable({ id, children }: Props) {
    const { isOver, setNodeRef } = useDroppable({ id: id });
    const style = { color: isOver ? "green" : undefined };

    return (
        <div ref={setNodeRef} style={style}>
            {children}
        </div>
    );
}
