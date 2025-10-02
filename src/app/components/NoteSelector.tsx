import { useRef, useState } from "react";
import "./NoteSelector.css";
import { useClickOutside } from "../../hooks/useClickOutside";

interface Props {
  title: string;
  editable: boolean;
  onClick: () => void;
}

export default function NoteSelector({ title, editable, onClick }: Props) {
  const [value, setValue] = useState(title);
  const [disabled, setDisabled] = useState(!editable);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
      <div className="selector-border" ref={wrapperRef}>
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
        <span className="material-symbols-outlined" onClick={onClick}>
          more_vert
        </span>
      </div>
    </>
  );
}
