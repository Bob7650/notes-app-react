interface Props {
    actionName: string;
    iconName: string;
    onClick?: () => void;
}

export default function PopoverItem({ actionName, iconName, onClick }: Props) {
    return (
        <button className="item-action-button" onClick={onClick}>
            <span className="item-action-name">{actionName}</span>
            <span className="item-action-icon material-symbols-outlined">
                {iconName}
            </span>
        </button>
    );
}
