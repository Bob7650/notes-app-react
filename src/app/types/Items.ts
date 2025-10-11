import { useReducer, useState, type ActionDispatch, type Reducer } from "react";
import type { NoteElement } from "./NoteElement";
import type { ItemsAction } from "./ItemsAciton";

export default class Items {
  items: NoteElement[];
  dispatch: ActionDispatch<[ItemsAction]>;
  selectedId: string;
  setSelectedId: Function;

  constructor(initialState: NoteElement[] = [], selectedInd: number) {
    [this.items, this.dispatch] = useReducer(this.itemsReducer, initialState);
    [this.selectedId, this.setSelectedId] = useState(
      this.items[selectedInd].id
    );
  }

  add() {
    const newId = Math.random().toString(16).slice(2);

    this.dispatch({
      type: "ADD_ITEM",
      payload: {
        id: newId,
        title: "Untitled",
        contents: "Put your notes here!",
        editing: false,
      },
    });
    this.selectId(newId);
  }

  remove(id: string) {
    const callerInd: number = this.items.findIndex((item) => item.id === id);
    const selectedIndex: number = this.items.findIndex(
      (item) => item.id === this.selectedId
    );

    if (callerInd <= selectedIndex) {
      this.setSelectedId(this.items[selectedIndex - 1]);
    }

    this.dispatch({
      type: "REMOVE_ITEM",
      id: id,
    });
  }

  rename() {}

  selectId(id: string) {
    this.setSelectedId(id);
  }

  getSelectedId(): string {
    return this.selectedId;
  }

  getSelectedItem(): NoteElement | undefined {
    return this.items.find((item) => item.id === this.getSelectedId());
  }

  getItems(): NoteElement[] {
    return this.items;
  }

  private itemsReducer: Reducer<NoteElement[], ItemsAction> = (
    items,
    action
  ) => {
    switch (action.type) {
      case "ADD_ITEM": {
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
}
