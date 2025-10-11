import { useReducer, useState, type ActionDispatch, type Reducer } from "react";
import type { NoteElement } from "./NoteElement";
import type { ItemsAction } from "./ItemsAciton";

export default class Items {
  items: NoteElement[];
  dispatch: ActionDispatch<[ItemsAction]>;
  selected: NoteElement;
  setSelected: Function;

  constructor(initialState: NoteElement[] = [], selectedInd: number) {
    [this.items, this.dispatch] = useReducer(itemsReducer, initialState);
    [this.selected, this.setSelected] = useState(this.items[selectedInd]);
  }

  add() {
    this.dispatch({
      type: "ADD_ITEM",
      payload: {
        id: "",
        title: "Untitled",
        contents: "Put your notes here!",
        editing: false,
      },
    });
  }

  remove(id: string) {
    this.dispatch({
      type: "REMOVE_ITEM",
      id: id,
    });
  }

  rename() {}

  select(id: string){
    const temp = this.items.find((item)=>item.id===id);
    if(temp)
      this.setSelected(temp);
  }

  getSelected(): NoteElement {
    return this.selected;
  }

  getItems(): NoteElement[] {
    return this.items;
  }
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
