import "./MainPage.css";

import settings from "../../assets/settings_24dp.svg";
import ReorderableList from "../components/ReorderableList";
import AddNote from "../components/AddNote";
import { useReducer, useState, type Reducer } from "react";
import type { NoteElement } from "../types/NoteElement";
import type { ItemsAction } from "../types/ItemsAciton";
import ModalPopup from "../components/popups/ModalPopup";
import AddPopup from "../components/popups/AddPopup";

function MainPage() {
  const [items, dispatch] = useReducer(
    itemsReducer,
    [{ title: "Title", contents: "Blah blah blah" }] //Initial state
  );

  const onAddHandler = (title: string, contents: string) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { title: title, contents: contents },
    });
  };

  const [isPopupVisible, setPopupVisible] = useState(false);

  return (
    <>
      <div className="mainPageContainer">
        <div className="topbar">
          <p>Notes</p>
          <input type="image" src={settings} />
        </div>
        <div className="contentContainer">
          <ReorderableList items={items} />
          <AddNote
            onClick={() => {
              setPopupVisible(true);
            }}
          />
        </div>
        <ModalPopup isVisible={isPopupVisible}>
          <AddPopup
            onDismiss={() => setPopupVisible(false)}
            onSave={(title: string) =>
              onAddHandler(title, "Put your notes here!")
            }
          />
        </ModalPopup>
      </div>
    </>
  );
}

// Items is passed autamaticaly, action we pass ourselves
const itemsReducer: Reducer<NoteElement[], ItemsAction> = (items, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      return [...items, action.payload];
    }
    case "REMOVE_ITEM": {
      return items.splice(action.index, 1);
    }
    default: {
      return items;
    }
  }
};

export default MainPage;
