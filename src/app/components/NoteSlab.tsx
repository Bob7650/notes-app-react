import "./NoteSlab.css";
import more from "../../assets/more_vert_24dp.svg";

interface Props {
  title: string;
  content: string;
  onNoteClicked: () => void;
  onMoreClicked: () => void;
}

export default function NoteSlab({
  title,
  content,
  onNoteClicked,
  onMoreClicked,
}: Props) {
  return (
    <>
      <div className="slabWrapper">
        <div className="slabTop">
          <p>{title}</p>
          <img src={more} alt="More" onClick={onMoreClicked} />
        </div>

        <div className="slabBot" onClick={onNoteClicked}>
          <p>{content}</p>
        </div>
      </div>
    </>
  );
}
