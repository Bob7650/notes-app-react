import type { ReactElement } from "react";
import "./MorePopup.css";

interface Props {
  children: ReactElement;
}

export default function MorePopup({ children }: Props) {
  return (
    <>
      <div className="popupContainer">{children}</div>
    </>
  );
}
