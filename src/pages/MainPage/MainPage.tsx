import { useRef, useState } from "react";
import IconButton from "../../shared/components/IconButton";
import NoteCard from "../../shared/components/NoteCard";
import NoteSelector from "../../shared/components/NoteSelector";
import TextEditor from "../../shared/components/TextEditor";
import "./MainPage.style.css";
import type { NoteObject } from "../../shared/types/NoteObject";

export default function MainPage() {
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [openedCards, setOpenedTabs] = useState<number[]>([]);
    const [notesSnapshot, setNotesState] = useState<NoteObject[]>(() => {
        const savedNotes = localStorage.getItem("notes");
        if (!savedNotes) localStorage.setItem("notes", "[]");
        return savedNotes ? JSON.parse(savedNotes) : [];
    });

    /**
     * Adds new note
     */
    const handleAdd = () => {
        const newNote: NoteObject = {
            id: Date.now(),
            title: "New Example Note",
            content: "This is a content of a New Example Note",
            depth: 0,
        };

        const newArray = [...notesSnapshot, newNote];

        updateStorage(newArray);
        syncReact();
    };

    /**
     * Renames a note
     * @param id id of a note that will be renamed
     * @param newTitle a new title that will be assigned to the note with above id
     */
    const handleRename = (id: number, newTitle: string) => {
        const newArray: NoteObject[] = notesSnapshot.map((item: NoteObject) =>
            item.id == id
                ? {
                      ...item,
                      title: newTitle,
                  }
                : item
        );

        updateStorage(newArray);
        syncReact();
    };

    /**
     * Changes/creates new tab
     * @param noteId id of a note, that wants its card to be opened
     */
    const handleNewTab = (noteId: number) => {
        const tabId = noteId;
        setOpenedTabs((tabs) =>
            tabs.includes(tabId) ? tabs : [...tabs, tabId]
        );
        setSelectedCardId(tabId);
        syncReact();
    };

    /**
     * Closes already opened card
     * @param cardId id of a card to be closed
     */
    const handleCloseTab = (cardId: number) => {
        setOpenedTabs(openedCards.filter((tab) => tab !== cardId));
        if (cardId === selectedCardId) setSelectedCardId(null);
    };

    /**
     * Function called by the DOM controlled div. Updates local storage layer with data provided.
     * @param updatedContent new content of a note
     * @param id id of a note, that will be changed
     */
    const handleUpdate = (updatedContent: string, id: number): void => {
        if (!id) return;

        const noteSpanshot = notesSnapshot.find((note) => note.id === id);

        if (!noteSpanshot) {
            console.error(`The updated note does not exist (note id: ${id})`);
            return;
        }

        const updatedNoteSnapshot: NoteObject = {
            ...noteSpanshot,
            content: updatedContent,
        };

        const updatedNotesSnapshot = notesSnapshot.map((note) =>
            note.id === updatedNoteSnapshot.id ? updatedNoteSnapshot : note
        );

        updateStorage(updatedNotesSnapshot);
    };

    /**
     * Synchronizes react with local storage
     */
    const syncReact = () => {
        //Sync React with local storage
        const notesJson = localStorage.getItem("notes");

        if (!notesJson) {
            console.error("Could not find notes in local storage!");
            return;
        }

        const storageNotes: NoteObject[] = JSON.parse(notesJson);
        setNotesState(storageNotes);

        console.log(`Synced React with storage.`);
    };

    /**
     * Utility function that saves notes to the local storage
     * @param updatedNotes NoteObject[] array that will be saved to storage
     */
    const updateStorage = (updatedNotes: NoteObject[]) => {
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
        console.log("Updated storage");
    };

    //For scrolling
    const mainTopBarRef = useRef<HTMLDivElement>(null);

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
                        <IconButton
                            iconName="edit_square"
                            onClick={handleAdd}
                        />
                        <IconButton iconName="create_new_folder" />
                        <IconButton iconName="sort_by_alpha" />
                    </div>
                    <ul className="folders-section">
                        {notesSnapshot.map((singleNote) => (
                            <li key={singleNote.id}>
                                <NoteSelector
                                    data={singleNote}
                                    isSelected={
                                        selectedCardId === singleNote.id
                                    }
                                    onClick={() => handleNewTab(singleNote.id)}
                                    onRename={handleRename}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
            <div className="main-panel-section">
                <div
                    className="main-top-bar bordered"
                    onWheel={(e) => {
                        if (!mainTopBarRef.current) return;

                        if (
                            mainTopBarRef.current.scrollWidth >
                            mainTopBarRef.current.clientWidth
                        ) {
                            e.preventDefault();
                            mainTopBarRef.current.scrollLeft += e.deltaY;
                        }
                    }}
                    ref={mainTopBarRef}
                >
                    <ul className="cards-section">
                        {openedCards.map((card) => (
                            <li key={card}>
                                <NoteCard
                                    title={
                                        notesSnapshot.find(
                                            (note) => note.id === card
                                        )?.title
                                            ? notesSnapshot.find(
                                                  (note) => note.id === card
                                              )?.title!!
                                            : ""
                                    }
                                    isSelected={selectedCardId === card}
                                    onClick={() => {
                                        handleNewTab(card);
                                    }}
                                    onClose={() => handleCloseTab(card)}
                                />
                            </li>
                        ))}
                    </ul>
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
                            <TextEditor
                                noteId={selectedCardId ? selectedCardId : -1}
                                initialValue={
                                    notesSnapshot.find(
                                        (note) => note.id === selectedCardId
                                    )?.content!!
                                }
                                onChange={() => {}}
                                onChangeDebounce={(updatedContent) =>
                                    handleUpdate(
                                        updatedContent,
                                        selectedCardId!!
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
