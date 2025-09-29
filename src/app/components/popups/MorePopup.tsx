import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";
import "./MorePopup.css";

interface Props {
  anchor?: HTMLImageElement;
  onDismiss: () => void;
  children: ReactElement;
}

export default function MorePopup({ children, onDismiss, anchor }: Props) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useLayoutEffect(() => {
    const anchorRect = anchor?.getBoundingClientRect();
    const popupRect = popupRef.current?.getBoundingClientRect();
    setPosition(calculatePosition(anchorRect, popupRect));
  }, [anchor, popupRef]);

  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onDismiss();
      }
    };

    document.addEventListener("mousedown", clickOutside);
    console.log("Mounted");
    return () => {
      document.removeEventListener("mousedown", clickOutside);
      console.log("Unmounted");
    };
  }, [onDismiss, popupRef]);

  return (
    <>
      <div
        className="morePopupContainer"
        ref={popupRef}
        style={{
          left: position.left,
          top: position.top,
        }}
      >
        {children}
      </div>
    </>
  );
}

function calculatePosition(
  anchorRect?: DOMRect,
  popupRect?: DOMRect
): {
  left: number;
  top: number;
} {
  if (!anchorRect || !popupRect) return { left: 0, top: 0 };

  return {
    left: anchorRect!!.left,
    top: anchorRect!!.top + popupRect.height / 2,
  };
}
