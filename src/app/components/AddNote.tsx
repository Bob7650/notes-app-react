import "./AddNote.css";

import addImg from "../../assets/add_24dp.svg";

interface Props {
  onClick: () => void;
}

function AddNote({ onClick }: Props) {
  return (
    <>
      <div className="addWrapper" onClick={onClick}>
        <img src={addImg} alt="Add" />
      </div>
    </>
  );
}

export default AddNote;
