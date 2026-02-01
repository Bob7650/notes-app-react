import DrawerTopBar from "./DrawerTopBar";
import DrawerToolBar from "./DrawerToolBar";
import DrawerFilesSection from "./DrawerFilesSection";

export default function MainPageDrawer() {
    return (
        <aside className="drawer-section">
            <DrawerTopBar />
            <div className="drawer-contents bordered">
                <DrawerToolBar />
                <DrawerFilesSection />
            </div>
        </aside>
    );
}
