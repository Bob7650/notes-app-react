import AppController from "../../shared/controllers/AppController";
import "./MainPage.style.css";
import MainPageDrawer from "./MainPageDrawer/MainPageDrawer";
import MainPagePanel from "./MainPagePanel/MainPagePanel";

export default function MainPage() {
    return (
        <>
            <AppController />
            <div className="app-container">
                <MainPageDrawer />
                <MainPagePanel />
            </div>
        </>
    );
}
