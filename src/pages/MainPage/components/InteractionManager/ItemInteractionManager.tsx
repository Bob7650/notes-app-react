import { useContext, type MouseEvent, type ReactNode } from "react";
import "./ItemInteractionManager.style.css";
import Draggable from "../../../../shared/components/Draggable";
import { MainPanelContext } from "../../../../shared/context/MainPanelContext/MainPanelContext";
import Droppable from "../../../../shared/components/Droppable";

interface Props {
    itemId: number;
    onMouseDown?: (
        e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    ) => void;
    children: ReactNode;
}

export default function ItemInteractionManager({
    itemId,
    onMouseDown,
    children,
}: Props) {
    const { selectedCardId } = useContext(MainPanelContext)!;

    return (
        <Draggable id={itemId}>
            <Droppable id={itemId}>
                <div
                    className={`selector-wrapper${
                        itemId === selectedCardId ? " selector-selected" : ""
                    }`}
                    onContextMenu={(e) => e.preventDefault()}
                    onMouseDown={(e) => {
                        onMouseDown?.(e);
                    }}
                >
                    {children}
                </div>
            </Droppable>
        </Draggable>
    );
}
