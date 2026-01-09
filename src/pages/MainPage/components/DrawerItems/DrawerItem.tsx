import { useContext, type MouseEvent } from "react";
import EditableLabel from "../../../../shared/components/EditableLabel";
import type { DrawerItem } from "../../../../shared/types/DrawerItem";
import Selector from "../Selector/Selector";
import { CardsContext } from "../../../../shared/context/TabsContext/CardsContext";
import { DrawerContext } from "../../../../shared/context/NotesContext/NotesContext";

interface Props {
    itemData: DrawerItem;
    onMouseDown: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
}

export default function DrawerItem({ itemData, onMouseDown }: Props) {
    const { selectedCardId } = useContext(CardsContext)!;
    const { renamingId, drawerActions, drawerMap } = useContext(DrawerContext)!;

    const handleNameChanged = (newValue: string, id: number) => {
        drawerActions.renameEntry(id, newValue);
        handleRenameCanceled();
    };

    const handleRenameCanceled = () => {
        drawerActions.cancelEntryRenaming();
    };

    return (
        <>
            <Selector
                isSelected={selectedCardId === itemData.id}
                onMouseDown={onMouseDown}
            >
                {itemData.isFolder && (
                    <span
                        className="material-symbols-outlined"
                        style={{
                            position: "relative",
                            top: 1,
                            left: -3,
                        }}
                    >
                        {/* TODO: change to isExpanded in the future */}
                        {true ? "arrow_drop_down" : "arrow_right"}
                    </span>
                )}
                <EditableLabel
                    initialValue={itemData.title}
                    canEdit={itemData.id === renamingId}
                    onNameChanged={(newValue) =>
                        handleNameChanged(newValue, itemData.id)
                    }
                    onRenameCanceled={handleRenameCanceled}
                />
            </Selector>
            {drawerMap.get(itemData.id)?.map((child) => (
                <DrawerItem itemData={child} onMouseDown={onMouseDown} />
            ))}
        </>
    );
}
