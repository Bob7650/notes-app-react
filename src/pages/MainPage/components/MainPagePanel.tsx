import { useContext } from "react";
import IconButton from "../../../shared/components/IconButton";
import TextEditor from "./TextEditor/TextEditor";
import { DrawerContext } from "../../../shared/context/NotesContext/NotesContext";
import TopBar from "./TopBar";
import { CardsContext } from "../../../shared/context/TabsContext/CardsContext";

export default function MainPagePanel() {
    const { notes, drawerActions: notesActions } = useContext(DrawerContext)!!;
    const { selectedCardId } = useContext(CardsContext)!!;

    return (
        <div className="main-panel-section">
            <TopBar />
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
                        <TextEditor
                            noteId={selectedCardId ? selectedCardId : -1}
                            initialValue={
                                notes.find((note) => note.id === selectedCardId)
                                    ?.content ?? ""
                            }
                            onChange={() => {}}
                            onChangeDebounce={(updatedContent) =>
                                notesActions.updateNoteContent(
                                    selectedCardId ?? -1,
                                    updatedContent
                                )
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
