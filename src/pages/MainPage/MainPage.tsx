import { useState } from "react";
import "./MainPage.style.css";
import type { NoteObject } from "../../shared/types/NoteObject";
import MainPageDrawer from "./components/MainPageDrawer";
import MainPagePanel from "./components/MainPagePanel";
import Popover from "../../shared/components/Popover";
import type { Rect } from "../../shared/types/Rect";
import PopoverItem from "../../shared/components/PopoverItem";

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
        console.log(`Array before ${JSON.stringify(notesSnapshot)}`);

        const newArray = notesSnapshot.map((note) =>
            note.id === id
                ? {
                      ...note,
                      title: newTitle,
                  }
                : note
        );
        console.log(`Renaming ${JSON.stringify(newArray)}`);

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

    // const handleDelete = (noteId: number) => {
    //     handleCloseCard(noteId);
    //     const indexToRemove = notesSnapshot.findIndex(
    //         (note) => note.id === noteId
    //     );

    //     if (indexToRemove === -1) {
    //         console.log(`Nothing to delete (noteId: ${noteId})`);
    //         return;
    //     }

    //     const updatedNotesSnapshot: NoteObject[] = notesSnapshot.splice(
    //         indexToRemove,
    //         1
    //     );

    //     updateStorage(updatedNotesSnapshot);
    //     syncReact();
    // };

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

    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [anchor, setAnchor] = useState<Rect>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    const handleDisplayPopover = (newAnchor: Rect) => {
        setAnchor(newAnchor);
        setPopoverOpen(true);
    };

    return (
        <div className="app-container">
            <MainPageDrawer
                handleAdd={handleAdd}
                handleNewTab={handleNewCard}
                handleRename={handleRename}
                handleDisplayPopover={handleDisplayPopover}
                selectedCardId={selectedCardId}
                notesSnapshot={notesSnapshot}
            />
            <MainPagePanel
                handleUpdate={handleUpdate}
                handleNewCard={handleNewCard}
                handleCloseCard={handleCloseCard}
                handleDisplayPopover={handleDisplayPopover}
                openedCards={openedCards}
                selectedCardId={selectedCardId}
                notesSnapshot={notesSnapshot}
            />
            <Popover
                isOpen={isPopoverOpen}
                anchor={anchor}
                onClose={() => {
                    setPopoverOpen(false);
                }}
            >
                <PopoverItem actionName="Copy" iconName="content_copy" />
                <PopoverItem actionName="Rename" iconName="edit" />
                <PopoverItem
                    actionName="Delete"
                    iconName="delete"
                    onClick={() => {
                        //handleDelete(1766062311127)
                    }}
                />
            </Popover>
        </div>
    );
}
