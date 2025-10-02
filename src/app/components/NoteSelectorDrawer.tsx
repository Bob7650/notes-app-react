import { useState } from "react";
import type { NoteElement } from "../types/NoteElement";
import NoteSelector from "./NoteSelector";
import "./NoteSelectorDrawer.css";
import MorePopup from "./popups/MorePopup";

interface Props {
  items: NoteElement[];
  selectedIndex: number;
  onHideSideDrawer: () => void;
  onAddClick: () => void;
  onSelectionChanged: (index: number) => void;
  onDelete: (index: number) => void;
  onRename: (id: number) => void;
}

export default function NoteSelectorDrawer({
  items,
  selectedIndex,
  onHideSideDrawer,
  onAddClick,
  onSelectionChanged,
  onRename,
  onDelete,
}: Props) {
  const [popupCaller, setPopupCaller] = useState(-1);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [isVisible, setVisible] = useState(false);

  return (
    <>
      <div className="note-drawer-wrapper">
        <div className="note-drawer-content">
          <div className="top-section">
            <p>Your Notes</p>
            <span
              className="material-symbols-outlined"
              onClick={onHideSideDrawer}
            >
              arrow_back_ios_new
            </span>
          </div>
          <div className="separator-section">
            <hr />
          </div>
          <div className="note-selector-section">
            <ul>
              {items.map((item, index) => (
                <li key={item.id}>
                  <NoteSelector
                    title={item.title}
                    isSelected={selectedIndex === index}
                    onBodyClick={() => onSelectionChanged(index)}
                    onMoreClick={(a) => {
                      setPopupCaller(index);
                      setAnchor(a);
                      setVisible(true);
                    }}
                    editable={item.editing}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="add-button-section">
            <button onClick={onAddClick}>
              <p>Add new Note</p>
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>
      </div>

      <MorePopup
        isVisible={isVisible}
        anchor={anchor}
        onRename={() => {
          onRename(popupCaller);
        }}
        onDelete={() => {
          onDelete(popupCaller);
        }}
        onDismiss={() => {
          setVisible(false);
        }}
      />
    </>
  );
}
