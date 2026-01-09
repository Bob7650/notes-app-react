import IconButton from "../../../../shared/components/IconButton";

export default function CardPlaceholder({ title }: { title: string }) {
    return (
        <div className={`card-wrapper`}>
            <span className="card-title">{title}</span>
            <IconButton iconName="close" />
        </div>
    );
}
