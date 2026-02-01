import { useEffect, useRef } from "react";
import "./TextEditor.style.css";

interface Props {
    noteId: string;
    initialValue: string;
    onChange?: (newValue: string) => void;
    onChangeDebounce?: (newValue: string) => void;
    debounceDelay?: number;
}

export default function TextEditor({
    noteId,
    initialValue = "",
    onChange,
    onChangeDebounce,
    debounceDelay = 400,
}: Props) {
    const timerRef = useRef<number | null>(null);
    const editorRef = useRef<HTMLDivElement | null>(null);
    const lastIdRef = useRef(noteId);

    useEffect(() => {
        if (editorRef.current && noteId !== lastIdRef.current) {
            editorRef.current.innerText = initialValue;
            lastIdRef.current = noteId;
        }
    }, [noteId]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const innerText = e.currentTarget.innerText;

        onChange?.(innerText);

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            if (onChangeDebounce) onChangeDebounce(innerText);
        }, debounceDelay);
    };

    return (
        <div
            ref={editorRef}
            className="text-editor"
            onInput={handleInput}
            contentEditable={true}
            suppressContentEditableWarning={true}
        />
    );
}
