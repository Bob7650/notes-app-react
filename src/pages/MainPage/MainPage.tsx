import IconButton from "../../shared/components/IconButton";
import NoteCard from "../../shared/components/NoteCard";
import NoteFolder from "../../shared/components/NoteFolder";
import NoteSelector from "../../shared/components/NoteSelector";
import TextEditor from "../../shared/components/TextEditor";
import "./MainPage.style.css";

export default function MainPage() {
    return (
        <div className="app-container">
            <aside className="drawer-section">
                <div className="drawer-top-bar bordered">
                    <IconButton iconName="folder" />
                    <IconButton iconName="search" />
                    <IconButton iconName="bookmark" />
                </div>
                <div className="drawer-contents bordered">
                    <div className="top-icons-section">
                        <IconButton iconName="edit_square" />
                        <IconButton iconName="create_new_folder" />
                        <IconButton iconName="sort_by_alpha" />
                    </div>
                    <ul className="folders-section">
                        <li>
                            <NoteFolder />
                        </li>
                        <li>
                            <NoteSelector depth={0} />
                        </li>
                    </ul>
                </div>
            </aside>
            <div className="main-panel-section">
                <div className="main-top-bar bordered">
                    <NoteCard isSelected={true} />
                    <NoteCard />
                    <NoteCard />
                </div>
                <div className="note-tools-section bordered">
                    <div className="tools-section">
                        <div className="arrow-container">
                            <IconButton iconName="arrow_back" />
                            <IconButton iconName="arrow_forward" />
                        </div>
                        <IconButton iconName="more_vert" />
                    </div>
                    <div className="note-section">
                        <div className="editor-wrapper">
                            <TextEditor />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
