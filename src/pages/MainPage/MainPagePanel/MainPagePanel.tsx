import { useContext } from "react";
import TextEditor from "./TextEditor/TextEditor";
import TopBar from "./PanelTopBar";
import { MainPanelContext } from "../../../shared/context/MainPanelContext/MainPanelContext";
import { FilesContext } from "../../../shared/context/FilesContext/FilesContext";
import PanelTools from "./PanelTools";

export default function MainPagePanel() {
    const { fileActions, contentById } = useContext(FilesContext)!;
    const { selectedFileId } = useContext(MainPanelContext)!;

    return (
        <div className="main-panel-section">
            <TopBar />
            <div className="note-tools-section bordered">
                <PanelTools />
                <div className="note-section">
                    <div className="editor-wrapper">
                        {selectedFileId ? (
                            <TextEditor
                                noteId={selectedFileId}
                                initialValue={contentById[selectedFileId]}
                                onChange={() => {}}
                                onChangeDebounce={(updatedContent) => {
                                    fileActions.updateContent(
                                        selectedFileId,
                                        updatedContent,
                                    );
                                }}
                            />
                        ) : (
                            //TODO: Replace with a welcome screen
                            <p>EFN</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
