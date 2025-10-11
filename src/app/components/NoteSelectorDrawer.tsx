import { useState } from "react";
import NoteSelector from "./NoteSelector";
import "./NoteSelectorDrawer.css";
import MorePopup from "./popups/MorePopup";
import type Items from "../types/Items";

interface Props {
  data: Items;
  onHideSideDrawer: () => void;
}

export default function NoteSelectorDrawer({ data, onHideSideDrawer }: Props) {
  const [popupCaller, setPopupCaller] = useState<string>("");
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
              {data.getItems().map((item) => (
                <li key={item.id}>
                  <NoteSelector
                    title={item.title}
                    isSelected={item.id === data.getSelectedId()}
                    onBodyClick={() => data.selectId(item.id)}
                    onMoreClick={(a) => {
                      setPopupCaller(item.id);
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
            <button onClick={() => data.add()}>
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
          data.rename();
        }}
        onDelete={() => {
          data.remove(popupCaller);
        }}
        onDismiss={() => {
          setVisible(false);
        }}
      />
    </>
  );
}
