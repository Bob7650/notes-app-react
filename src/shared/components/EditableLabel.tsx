import { useRef, useState } from "react";
import "./EditableLabel.style.css";

interface Props {
    initialValue: string;
    canEdit: boolean;
    onNameChanged: (newName: string) => void;
    onRenameCanceled: () => void;
}

export default function EditableLabel({
    onNameChanged,
    onRenameCanceled,
    initialValue,
    canEdit,
}: Props) {
    const [inputValue, setInputValue] = useState<string>(initialValue);
    const componentRef = useRef<HTMLInputElement>(null);

    const confirmRename = () => {
        onNameChanged(inputValue);
    };

    const cancelRename = () => {
        setInputValue(initialValue);
        onRenameCanceled();
    };

    return (
        <div ref={componentRef}>
            {canEdit ? (
                <input
                    className="editable-input"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            confirmRename();
                        }
                        if (e.key === "Escape") {
                            cancelRename();
                        }
                    }}
                    onBlur={confirmRename}
                    autoFocus
                />
            ) : (
                <span className="editable-label">{initialValue}</span>
            )}
        </div>
    );
}
