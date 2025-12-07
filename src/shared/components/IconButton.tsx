import "./IconButton.style.css";

interface Props {
    iconName: string;
}

export default function IconButton({ iconName }: Props) {
    return (
        <button className="icon-button">
            <span className="material-symbols-outlined">{iconName}</span>
        </button>
    );
}
