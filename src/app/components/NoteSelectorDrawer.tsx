import type { NoteElement } from "../types/NoteElement";
import NoteSelector from "./NoteSelector";
import "./NoteSelectorDrawer.css";

interface Props {
  items: NoteElement[];
  onHideSideDrawer: () => void;
  onAddClick: () => void;
  onSelectionChanged: () => void;
}

export default function NoteSelectorDrawer({
  items,
  onHideSideDrawer,
  onAddClick,
  onSelectionChanged,
}: Props) {
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
              {items.map((item) => (
                <li key={item.id}>
                  <NoteSelector
                    title={item.title}
                    onClick={onSelectionChanged}
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
    </>
  );
}
