import "./MainPage.css";

import { useReducer, useState, type Reducer } from "react";
import type { NoteElement } from "../types/NoteElement";
import type { ItemsAction } from "../types/ItemsAciton";
import TopBar from "../components/TopBar";
import NoteSelectorDrawer from "../components/NoteSelectorDrawer";
import NoteEditor from "../components/NoteEditor";

export default function MainPage() {
  const [items, dispatch] = useReducer(
    itemsReducer,
    [{ id: "predefined", title: "Title", contents: "Example", editing: false }] //Initial state
  );
  const onAddHandler = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: "",
        title: "Untitled",
        contents: "Put your notes here!",
        editing: false,
      },
    });
  };
  const onRemoveHandler = (id: string) => {
    dispatch({
      type: "REMOVE_ITEM",
      id: id,
    });
  };

  return (
    <>
      <TopBar />

      <div className="content-container">
        <div className="note-drawer-section">
          <NoteSelectorDrawer
            items={items}
            onHideSideDrawer={() => {}}
            onAddClick={onAddHandler}
            onSelectionChanged={() => {}}
          />
        </div>
        <div className="note-editor-section">
          <NoteEditor />
        </div>
      </div>
    </>
  );
}

const itemsReducer: Reducer<NoteElement[], ItemsAction> = (items, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      if (action.payload.id === "") {
        action.payload.id = Math.random().toString(16).slice(2);
      }
      return [...items, action.payload];
    }
    case "REMOVE_ITEM": {
      return items.filter((item) => item.id !== action.id);
    }
    default: {
      return items;
    }
  }
};
