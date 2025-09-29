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
  onRemove: (id: string) => void;
  onEdit: () => void;
}

export default function ReorderableList({ items, onRemove, onEdit }: Props) {
  const [popupAnchor, setPopupAnchor] = useState<HTMLImageElement>();
  const [isVisible, setVisible] = useState<boolean>(false);
  const [callerId, setCallerId] = useState<string>("");

  return (
    <>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <NoteSlab
              id={item.id}
              title={item.title}
              content={item.contents}
              onMoreClicked={(anchor, callerId) => {
                setCallerId(callerId);
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
          <>
            <MorePopupItem
              itemName="Delete"
              imgSrc={deleteIcon}
              imgAlt="Delete"
              onClick={() => {
                console.log("item clicked");
                onRemove(callerId);
              }}
            />
            <MorePopupItem
              itemName="Edit"
              imgSrc={deleteIcon}
              imgAlt="Edit"
              onClick={onEdit}
            />
          </>
        </MorePopup>
      </ModalPopup>
    </>
  );
}
