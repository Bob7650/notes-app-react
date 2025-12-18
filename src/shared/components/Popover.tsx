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
        if (!anchor || !popoverRef.current) return;

        const popoverData = popoverRef.current.getBoundingClientRect();

        let left = 0;
        let top = 0;

        if (anchor.x + popoverData.width > innerWidth) {
            // No horizontal fit
            left = anchor.x - popoverData.width + anchor.width;
        } else {
            // Fit
            left = anchor.x;
        }

        if (anchor.y + popoverData.height > innerHeight) {
            // No vertical fit
            top = anchor.y - popoverData.height;
        } else {
            // Fit
            top = anchor.y + anchor.height;
        }

        console.log(`Showing popover at: ${top} ${left}`);
        console.log(`Is Open: ${isOpen}`);

        setPosition({
            top: top,
            left: left,
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
