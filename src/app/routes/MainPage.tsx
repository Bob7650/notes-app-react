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
          <NoteSelectorDrawer data={items} onHideSideDrawer={() => {}} />
        </div>
        <div className="note-editor-section">
          {items.getSelectedItem() ? (
            <NoteEditor noteElement={items.getSelectedItem()!!} />
          ) : null}
        </div>
      </div>
    </>
  );
}
