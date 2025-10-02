import { useLayoutEffect, useRef, useState } from "react";
import "./MorePopup.css";

import { createPortal } from "react-dom";
import { useClickOutside } from "../../../hooks/useClickOutside";

interface Props {
  isVisible: boolean;
  anchor: HTMLElement | null;
  onRename: () => void;
  onDelete: () => void;
  onDismiss: () => void;
}

export default function MorePopup({
  isVisible,
  anchor,
  onRename,
  onDelete,
  onDismiss,
}: Props) {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  //TODO: update this to account for space needed for render
  useLayoutEffect(() => {
    if (popupRef.current && anchor) {
      const anchorRect = anchor.getBoundingClientRect();

      setPosition({ left: anchorRect.left, top: anchorRect.top + 25 });
    }
  }, [anchor]);

  useClickOutside(popupRef, onDismiss);

  if (!isVisible) return null;
  return createPortal(
    <>
      <div
        style={{ left: position.left, top: position.top }}
        ref={popupRef}
        className="more-popup-container"
      >
        <div
          className="mp-item-container"
          onClick={() => {
            onDelete();
            onDismiss();
          }}
        >
          <p>Delete</p>
          <span
            className="material-symbols-outlined"
            style={{ color: "var(--red)" }}
          >
            delete
          </span>
        </div>
        <div
          className="mp-item-container"
          onClick={() => {
            onRename();
            onDismiss();
          }}
        >
          <p>Rename</p>
          <span className="material-symbols-outlined">edit</span>
        </div>
      </div>
    </>,
    document.getElementById("portal")!!
  );
}
