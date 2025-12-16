import { createPortal } from "react-dom";
import "./Popover.style.css";
import PopoverItem from "./PopoverItem";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { Rect } from "../types/Rect";
import useOutsideClick from "../hooks/useOutsideClick";

interface Props {
    isOpen: boolean;
    anchor: Rect | null;
    onClose: () => void;
}

export default function Popover({ isOpen, anchor, onClose }: Props) {
    const popoverRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<CSSProperties | undefined>(
        undefined
    );

    //TODO: fix this so that it renders right
    useLayoutEffect(() => {
        if (!anchor) return;

        setPosition({
            top: anchor.y + anchor.height,
            left: anchor.x - 150,
        });
    }, [anchor]);

    useOutsideClick(onClose, popoverRef);

    if (!isOpen) return null;
    return createPortal(
        <div className="popover-wrapper" ref={popoverRef} style={position}>
            <PopoverItem actionName="Delete" iconName="delete" />
        </div>,
        document.getElementById("portal")!!
    );
}
