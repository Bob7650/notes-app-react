import "./AddPopup.css";

import { useState } from "react";

interface Props {
  onDismiss: () => void;
  onSave: (title: string) => void;
}

export default function AddPopup({ onDismiss, onSave }: Props) {
  const [inpValue, setInpValue] = useState("");

  return (
    <>
      <div className="overlay">
        <div className="popup">
          <p>Enter name</p>
          <input
            value={inpValue}
            onChange={(e) => setInpValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSave(inpValue);
                setInpValue("");
                onDismiss();
              }
            }}
          />
          <div className="buttonWrapper">
            <button
              onClick={() => {
                setInpValue("");
                onDismiss();
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(inpValue);
                setInpValue("");
                onDismiss();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
