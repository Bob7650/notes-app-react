import IconButton from "../../../shared/components/IconButton";

export default function DrawerTopBar() {
    return (
        <div className="drawer-top-bar bordered">
            <IconButton iconName="folder" />
            <IconButton iconName="search" />
        </div>
    );
}
