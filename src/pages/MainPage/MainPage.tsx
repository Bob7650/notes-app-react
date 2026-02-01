import "./MainPage.style.css";
import MainPageDrawer from "./components/MainPageDrawer";
import MainPagePanel from "./components/MainPagePanel";
import DrawerContextProvider from "../../shared/context/DrawerContext/DrawerContextProvider";
import MainPanelContextProvider from "../../shared/context/MainPanelContext/MainPanelContextProvider";
import AppController from "../../shared/controllers/AppController";

export default function MainPage() {
    return (
        <MainPanelContextProvider>
            <DrawerContextProvider>
                <AppController />
                <div className="app-container">
                    <MainPageDrawer />
                    <MainPagePanel />
                </div>
            </DrawerContextProvider>
        </MainPanelContextProvider>
    );
}
