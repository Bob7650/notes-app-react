import NoteSelector from "./NoteSelector";
import "./NoteSelectorDrawer.css";

export default function NoteSelectorDrawer() {
  const idk: string[] = ["one", "two", "three", "four", "five"];

  return (
    <>
      <div className="note-drawer-wrapper">
        <div className="note-drawer-content">
          <div className="top-section">
            <p>Your Notes</p>
            <span className="material-symbols-outlined">
              arrow_back_ios_new
            </span>
          </div>
          <div className="separator-section">
            <hr />
          </div>
          <div className="note-selector-section">
            <ul>
              {idk.map((item) => (
                <li key={item}>
                  <NoteSelector title={item} />
                </li>
              ))}
            </ul>
          </div>
          <div className="add-button-section">
            <button>
              <p>Add new Note</p>
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
