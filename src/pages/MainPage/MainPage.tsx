import "./MainPage.style.css";
import MainPageDrawer from "./components/MainPageDrawer";
import MainPagePanel from "./components/MainPagePanel";
import NotesContextProvider from "../../shared/context/NotesContext/NotesContextProvider";
import CardsContextProvider from "../../shared/context/TabsContext/CardsContextProvider";
import AppController from "../../shared/controllers/AppController";

export default function MainPage() {
    return (
        <CardsContextProvider>
            <NotesContextProvider>
                <AppController />
                <div className="app-container">
                    <MainPageDrawer />
                    <MainPagePanel />
                </div>
            </NotesContextProvider>
        </CardsContextProvider>
    );
}
