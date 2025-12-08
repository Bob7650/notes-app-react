import { useRef, useState } from "react";
import IconButton from "../../shared/components/IconButton";
import NoteCard from "../../shared/components/NoteCard";
import NoteSelector from "../../shared/components/NoteSelector";
import TextEditor from "../../shared/components/TextEditor";
import "./MainPage.style.css";
import type { NoteObject } from "../../shared/types/NoteObject";

export default function MainPage() {
    const [selectedCardId, setSelectedTabId] = useState<number | null>(null);
    const [openedCards, setOpenedTabs] = useState<number[]>([]);
    const [notes, setNotes] = useState<NoteObject[]>([
        {
            id: 1,
            title: "Example Note",
            content: "This is a content of an Example Note",
            depth: 0,
        },
        {
            id: 2,
            title: "Example Note2",
            content: "This is a content of an Example Note 2",
            depth: 0,
        },
    ]);

    const handleAdd = () => {
        setNotes([
            ...notes,
            {
                id: Date.now(),
                title: "New Example Note",
                content: "This is a content of a New Example Note",
                depth: 0,
            },
        ]);
    };

    const handleNewTab = (noteId: number) => {
        setOpenedTabs((tabs) =>
            tabs.includes(noteId) ? tabs : [...tabs, noteId]
        );
        setSelectedTabId(noteId);
    };

    const handleCloseTab = (tabId: number) => {
        setOpenedTabs(openedCards.filter((tab) => tab !== tabId));
        setSelectedTabId(openedCards.length - 1);
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
                        {notes.map((singleNote) => (
                            <li key={singleNote.id}>
                                <NoteSelector
                                    data={singleNote}
                                    isSelected={
                                        selectedCardId === singleNote.id
                                    }
                                    onClick={() => handleNewTab(singleNote.id)}
                                    onRename={(
                                        id: number,
                                        newTitle: string
                                    ) => {
                                        const newArray: NoteObject[] =
                                            notes.map((item: NoteObject) =>
                                                item.id == id
                                                    ? {
                                                          ...item,
                                                          title: newTitle,
                                                      }
                                                    : item
                                            );
                                        console.log(newTitle);
                                        setNotes(newArray);
                                    }}
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
                                        notes.find((note) => note.id === card)
                                            ?.title
                                            ? notes.find(
                                                  (note) => note.id === card
                                              )?.title!!
                                            : ""
                                    }
                                    isSelected={selectedCardId === card}
                                    onClick={() => {
                                        setSelectedTabId(card);
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
                                value={
                                    notes.find(
                                        (note) => note.id === selectedCardId
                                    )?.content
                                }
                                onChange={(nv) => console.log("Normal: " + nv)}
                                onChangeDebounce={(nv) =>
                                    console.log("Debounce: " + nv)
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
