import "./TextEditor.style.css";

interface Props {
    value?: string;
}

export default function TextEditor({ value }: Props) {
    return (
        <div
            className="text-editor"
            contentEditable={true}
            suppressContentEditableWarning={true}
        >
            {value}
        </div>
    );
}
