interface Props {
    actionName: string;
    iconName: string;
    isDanger?: boolean;
    onClick?: () => void;
}

export default function PopoverItem({
    actionName,
    iconName,
    isDanger = false,
    onClick,
}: Props) {
    return (
        <button className="item-action-button" onClick={onClick}>
            <span
                className="item-action-name"
                style={isDanger ? { color: "var(--text-danger)" } : undefined}
            >
                {actionName}
            </span>
            <span
                className="item-action-icon material-symbols-outlined"
                style={isDanger ? { color: "var(--icon-danger)" } : undefined}
            >
                {iconName}
            </span>
        </button>
    );
}
