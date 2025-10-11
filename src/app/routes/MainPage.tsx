import "./MainPage.css";

import { useState } from "react";
import TopBar from "../components/TopBar";
import NoteSelectorDrawer from "../components/NoteSelectorDrawer";
import NoteEditor from "../components/NoteEditor";
import Items from "../types/Items";

export default function MainPage() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const items: Items = new Items(
    [{ id: "predefined", title: "Title", contents: "Example", editing: false }],
    0
  );

  return (
    <>
      <TopBar />

      <div className="content-container">
        <div className="note-drawer-section">
          <NoteSelectorDrawer
            items={items.getItems()}
            selectedId={items.getSelected().id}
            onHideSideDrawer={() => {}}
            onAddClick={() => items.add()}
            onSelectionChanged={(id) => {
              items.select(id);
            }}
            onDelete={(callerInd: number, callerId: string) => {
              if (callerInd <= selectedIndex) {
                setSelectedIndex(selectedIndex - 1);
              }
              items.remove(callerId);
            }}
            onRename={(callerId: number) => {}}
          />
        </div>
        <div className="note-editor-section">
          {selectedIndex < 0 ? null : ( //TODO: replace with some nicer screen
            <NoteEditor noteElement={items.getSelected()} />
          )}
        </div>
      </div>
    </>
  );
}
