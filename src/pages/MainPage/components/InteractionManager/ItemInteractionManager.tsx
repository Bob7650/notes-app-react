import { type MouseEvent, type ReactNode } from "react";
import "./ItemInteractionManager.style.css";

interface Props {
    onMouseDown?: (
        e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    ) => void;
    children: ReactNode;
    isSelected?: boolean;
}

export default function ItemInteractionManager({
    onMouseDown,
    children,
    isSelected,
}: Props) {
    return (
        <>
            <div
                className={`selector-wrapper${
                    isSelected ? " selector-selected" : ""
                }`}
                onContextMenu={(e) => e.preventDefault()}
                onMouseDown={(e) => {
                    onMouseDown?.(e);
                }}
            >
                {children}
            </div>
        </>
    );
}
