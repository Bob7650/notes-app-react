import { useEffect, useState } from "react";
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

        setNotesState(newArray);
    };

    /**
     * Renames a note
     * @param id id of a note that will be renamed
     * @param newTitle a new title that will be assigned to the note with above id
     */
    const handleRename = (id: number, newTitle: string) => {
        const newArray = notesSnapshot.map((note) =>
            note.id === id
                ? {
                      ...note,
                      title: newTitle,
                  }
                : note
        );

        setNotesState(newArray);
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
        const noteSpanshot = notesSnapshot.find((note) => note.id === id);

        if (!noteSpanshot) {
            console.error(`No note to write to! (note id: ${id})`);
            return;
        }

        const updatedNoteSnapshot: NoteObject = {
            ...noteSpanshot,
            content: updatedContent,
        };

        const updatedNotesSnapshot = notesSnapshot.map((note) =>
            note.id === updatedNoteSnapshot.id ? updatedNoteSnapshot : note
        );

        setNotesState(updatedNotesSnapshot);
    };

    const handleDelete = (noteId: number) => {
        handleCloseCard(noteId);
        const indexToRemove = notesSnapshot.findIndex(
            (note) => note.id === noteId
        );

        if (indexToRemove === -1) {
            console.error(`Nothing to delete! (noteId: ${noteId})`);
            return;
        }

        const updatedNotesSnapshot: NoteObject[] = notesSnapshot.slice();
        updatedNotesSnapshot.splice(indexToRemove, 1);

        setNotesState(updatedNotesSnapshot);
    };

    /**
     * Utility function that saves notes to the local storage
     */
    const updateStorage = () => {
        localStorage.setItem("notes", JSON.stringify(notesSnapshot));
    };

    useEffect(updateStorage, [notesSnapshot]);

    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [popoverCaller, setPopoverCaller] = useState<number | null>(null);
    const [anchor, setAnchor] = useState<Rect>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    const handleDisplayPopover = (callerId: number, newAnchor: Rect) => {
        setPopoverCaller(callerId);
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
                        if (!popoverCaller) {
                            console.error("No popover open!");
                            return;
                        }
                        handleDelete(popoverCaller);
                    }}
                />
            </Popover>
        </div>
    );
}
