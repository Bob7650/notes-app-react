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
                        {/* TODO: Render Text Editor only when any card is selected */}
                        {selectedFileId && (
                            <TextEditor
                                noteId={selectedFileId}
                                initialValue={
                                    selectedFileId
                                        ? contentById[selectedFileId]
                                        : ""
                                }
                                onChange={() => {}}
                                onChangeDebounce={(updatedContent) => {
                                    fileActions.updateContent(
                                        selectedFileId,
                                        updatedContent,
                                    );
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
