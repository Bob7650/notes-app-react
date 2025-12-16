import type { RefObject } from "react";
import "./IconButton.style.css";

interface Props {
    iconName: string;
    onClick?: () => void;
    ref?: RefObject<HTMLButtonElement | null>;
}

export default function IconButton({ iconName, onClick, ref }: Props) {
    return (
        <button
            ref={ref}
            className="icon-button"
            onClick={(e) => {
                if (onClick) {
                    e.stopPropagation();
                    onClick();
                }
            }}
        >
            <span className="material-symbols-outlined">{iconName}</span>
        </button>
    );
}
