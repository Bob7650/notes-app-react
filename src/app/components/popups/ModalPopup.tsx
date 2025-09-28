import type { ReactElement } from "react";

import ReactDOM from "react-dom";

interface Props {
  isVisible: boolean;
  children: ReactElement;
}

export default function ModalPopup({ isVisible, children }: Props) {
  if (!isVisible) return null;
  return ReactDOM.createPortal(children, document.getElementById("portal")!!);
}
