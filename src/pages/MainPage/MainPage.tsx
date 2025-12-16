import { useState } from "react";
import "./MainPage.style.css";
import type { NoteObject } from "../../shared/types/NoteObject";
import MainPageDrawer from "./components/MainPageDrawer";
import MainPagePanel from "./components/MainPagePanel";

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
            title: "Untitled",
            content: "",
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
    const handleNewCard = (noteId: number) => {
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
    const handleCloseCard = (cardId: number) => {
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

    return (
        <div className="app-container">
            <MainPageDrawer
                handleAdd={handleAdd}
                handleNewTab={handleNewCard}
                handleRename={handleRename}
                selectedCardId={selectedCardId}
                notesSnapshot={notesSnapshot}
            />
            <MainPagePanel
                handleUpdate={handleUpdate}
                handleNewCard={handleNewCard}
                handleCloseCard={handleCloseCard}
                openedCards={openedCards}
                selectedCardId={selectedCardId}
                notesSnapshot={notesSnapshot}
            />
        </div>
    );
}
