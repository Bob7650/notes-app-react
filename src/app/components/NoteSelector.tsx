import "./NoteSelector.css";

interface Props {
  title: string;
}

export default function NoteSelector({ title }: Props) {
  return (
    <>
      <div className="selector-border">
        <p>{title}</p>
        <span className="material-symbols-outlined">more_vert</span>
      </div>
    </>
  );
}
