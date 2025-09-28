import "./ReorderableList.css";

import NoteSlab from "./NoteSlab";
import type { NoteElement } from "../types/NoteElement";
import ModalPopup from "./popups/ModalPopup";
import MorePopup from "./popups/MorePopup";
import MorePopupItem from "./popups/MorePopupItem";
import deleteIcon from "../../assets/delete_24dp.svg";

interface Props {
  items: NoteElement[];
}

function ReorderableList({ items }: Props) {
  return (
    <>
      <ul>
        {items.map((item) => (
          <li key={item.title}>
            <NoteSlab
              title={item.title}
              content={item.contents}
              onMoreClicked={() => console.log("More clicked!")}
              onNoteClicked={() => console.log("Note clicked!")}
            />
          </li>
        ))}
      </ul>
      <ModalPopup isVisible={true}>
        <MorePopup>
          <MorePopupItem itemName="Delete" imgSrc={deleteIcon} imgAlt="Del" />
        </MorePopup>
      </ModalPopup>
    </>
  );
}

export default ReorderableList;
