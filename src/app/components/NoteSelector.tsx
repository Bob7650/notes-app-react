import { useRef, useState } from "react";
import "./NoteSelector.css";
import { useClickOutside } from "../../hooks/useClickOutside";

interface Props {
  title: string;
  editable: boolean;
  isSelected: boolean;
  onMoreClick: (element: HTMLSpanElement | null) => void;
  onBodyClick: () => void;
}

export default function NoteSelector({
  title,
  editable,
  isSelected,
  onMoreClick,
  onBodyClick,
}: Props) {
  const [value, setValue] = useState(title);
  const [disabled, setDisabled] = useState(!editable);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const moreButtRef = useRef<HTMLSpanElement>(null);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setDisabled(true);
    }
  };

  useClickOutside(wrapperRef, () => {
    if (!disabled) {
      setDisabled(true);
    }
  });

  return (
    <>
      <div
        className={
          isSelected ? "selector-border selector-selected" : "selector-border"
        }
        ref={wrapperRef}
        onClick={onBodyClick}
      >
        <div>
          <input
            readOnly={disabled}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
        <span
          className="material-symbols-outlined"
          onClick={() => onMoreClick(moreButtRef.current)}
          ref={moreButtRef}
        >
          more_vert
        </span>
      </div>
    </>
  );
}
