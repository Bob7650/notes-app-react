import "./ReorderableList.css";

import NoteSlab from "./NoteSlab";
import type { NoteElement } from "../types/NoteElement";
import ModalPopup from "./popups/ModalPopup";
import MorePopup from "./popups/MorePopup";
import MorePopupItem from "./popups/MorePopupItem";
import deleteIcon from "../../assets/delete_24dp.svg";
import { useState } from "react";

interface Props {
  items: NoteElement[];
}

export default function ReorderableList({ items }: Props) {
  const [popupAnchor, setPopupAnchor] = useState<HTMLImageElement>();
  const [isVisible, setVisible] = useState<boolean>(false);

  return (
    <>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <NoteSlab
              id={item.id}
              title={item.title}
              content={item.contents}
              onMoreClicked={(anchor) => {
                setPopupAnchor(anchor);
                setVisible(true);
              }}
              onNoteClicked={() => console.log("Note clicked!")}
            />
          </li>
        ))}
      </ul>
      <ModalPopup isVisible={isVisible}>
        <MorePopup
          anchor={popupAnchor}
          onDismiss={() => {
            setVisible(false);
          }}
        >
          <MorePopupItem itemName="Delete" imgSrc={deleteIcon} imgAlt="Del" />
        </MorePopup>
      </ModalPopup>
    </>
  );
}
