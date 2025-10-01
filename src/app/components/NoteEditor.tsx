import "./NoteEditor.css";

export default function NoteEditor() {
  return (
    <>
      <div className="editor-wrapper">
        <div className="editor-content">
          <div className="title-section">
            <p>Title</p>
          </div>
          <div className="separator-section-editor">
            <hr />
          </div>
          <div className="text-editor-section">
            <div className="text-editor" contentEditable="true"></div>
          </div>
        </div>
      </div>
    </>
  );
}
