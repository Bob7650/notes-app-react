import type { NoteElement } from "../types/NoteElement";
import "./NoteEditor.css";

interface Props {
  noteElement: NoteElement;
}

export default function NoteEditor({ noteElement }: Props) {
  return (
    <>
      <div className="editor-wrapper">
        <div className="editor-content">
          <div className="title-section">
            <p>{noteElement.title}</p>
          </div>
          <div className="separator-section-editor">
            <hr />
          </div>
          <div className="text-editor-section">
            <div
              className="text-editor"
              contentEditable="true"
              suppressContentEditableWarning={true}
            >
              {noteElement.contents}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
