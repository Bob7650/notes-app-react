import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

interface Props {
    id: string;
    canDropInto: boolean;
    children: ReactNode;
}

export default function Droppable({ id, canDropInto, children }: Props) {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
        disabled: !canDropInto,
    });
    const style = {
        color: canDropInto ? "var(--text-default)" : "var(--text-debug)",
    };

    return (
        <div ref={setNodeRef} style={style}>
            {children}
        </div>
    );
}
