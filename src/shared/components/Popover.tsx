import { createPortal } from "react-dom";
import "./Popover.style.css";
import {
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from "react";
import type { Rect } from "../types/Rect";
import useOutsideClick from "../hooks/useOutsideClick";

interface Props {
    isOpen: boolean;
    anchor: Rect | null;
    onClose: () => void;
    children: ReactNode | ReactNode[];
}

export default function Popover({ isOpen, anchor, onClose, children }: Props) {
    const popoverRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<CSSProperties | undefined>(
        undefined
    );

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

        setPosition({
            top: top,
            left: left,
        });
    }, [anchor]);

    useOutsideClick(onClose, popoverRef);

    if (!isOpen) return null;
    return createPortal(
        <div
            className="popover-wrapper"
            ref={popoverRef}
            style={position}
            onClick={onClose}
        >
            {children}
        </div>,
        document.getElementById("portal")!!
    );
}
