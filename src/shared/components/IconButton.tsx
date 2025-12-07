import "./IconButton.style.css";

interface Props {
    iconName: string;
    onClick?: () => void;
}

export default function IconButton({ iconName, onClick }: Props) {
    return (
        <button className="icon-button" onClick={onClick}>
            <span className="material-symbols-outlined">{iconName}</span>
        </button>
    );
}
