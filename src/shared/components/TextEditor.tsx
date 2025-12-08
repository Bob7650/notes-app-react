import { useRef } from "react";
import "./TextEditor.style.css";

interface Props {
    value?: string;
    onChange?: (newValue: string) => void;
    onChangeDebounce?: (newValue: string) => void;
    debounceDelay?: number;
}

export default function TextEditor({
    value,
    onChange,
    onChangeDebounce,
    debounceDelay = 400,
}: Props) {
    const timerRef = useRef<number | null>(null);

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
            className="text-editor"
            onInput={handleInput}
            contentEditable={true}
            suppressContentEditableWarning={true}
        >
            {value}
        </div>
    );
}
