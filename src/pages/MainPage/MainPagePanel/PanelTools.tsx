import IconButton from "../../../shared/components/IconButton";

export default function PanelTools() {
    return (
        <div className="tools-section">
            <div className="arrow-container">
                <IconButton iconName="arrow_back" />
                <IconButton iconName="arrow_forward" />
            </div>
            <IconButton iconName="more_vert" />
        </div>
    );
}
