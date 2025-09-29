import "./NoteSlab.css";
import more from "../../assets/more_vert_24dp.svg";
import { useRef } from "react";

interface Props {
  id: string;
  title: string;
  content: string;
  onNoteClicked: () => void;
  onMoreClicked: (anchor: HTMLImageElement, callerId: string) => void;
}

export default function NoteSlab({
  id,
  title,
  content,
  onNoteClicked,
  onMoreClicked,
}: Props) {
  const moreButtonRef = useRef<HTMLImageElement>(null);

  return (
    <>
      <div id={id.toString()} className="slabWrapper">
        <div className="slabTop">
          <p>{title}</p>
          <img
            ref={moreButtonRef}
            src={more}
            alt="More"
            onClick={() => {
              if (moreButtonRef.current)
                onMoreClicked(moreButtonRef.current, id);
            }}
          />
        </div>

        <div className="slabBot" onClick={onNoteClicked}>
          <p>{content}</p>
        </div>
      </div>
    </>
  );
}
