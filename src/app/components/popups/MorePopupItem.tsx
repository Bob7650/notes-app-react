interface Props {
  itemName: string;
  imgSrc: string;
  imgAlt: string;
  onClick: () => void;
}

export default function MorePopupItem({
  itemName,
  imgSrc,
  imgAlt,
  onClick,
}: Props) {
  return (
    <>
      <div className="itemContainer" onClick={onClick}>
        <p>{itemName}</p>
        <img src={imgSrc} alt={imgAlt} />
      </div>
    </>
  );
}
