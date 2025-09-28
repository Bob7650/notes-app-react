interface Props {
  itemName: string;
  imgSrc: string;
  imgAlt: string;
}

export default function MorePopupItem({ itemName, imgSrc, imgAlt }: Props) {
  return (
    <>
      <div className="itemContainer">
        <p>{itemName}</p>
        <img src={imgSrc} alt={imgAlt} />
      </div>
    </>
  );
}
