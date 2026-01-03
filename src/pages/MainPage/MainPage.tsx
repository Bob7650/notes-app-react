import "./MainPage.style.css";
import MainPageDrawer from "./components/MainPageDrawer";
import MainPagePanel from "./components/MainPagePanel";
import NotesContextProvider from "../../shared/context/NotesContext/NotesContextProvider";
import TabsContextProvider from "../../shared/context/TabsContext/TabsContextProvider";
import AppController from "../../shared/controllers/AppController";

export default function MainPage() {
    return (
        <TabsContextProvider>
            <NotesContextProvider>
                <AppController />
                <div className="app-container">
                    <MainPageDrawer />
                    <MainPagePanel />
                </div>
            </NotesContextProvider>
        </TabsContextProvider>
    );
}
