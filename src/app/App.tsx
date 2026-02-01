import MainPage from "../pages/MainPage/MainPage";
import DrawerContextProvider from "../shared/context/DrawerContext/DrawerContextProvider";
import FilesContextProvider from "../shared/context/FilesContext/FilesContextProvider";
import MainPanelContextProvider from "../shared/context/MainPanelContext/MainPanelContextProvider";

function App() {
    return (
        <MainPanelContextProvider>
            <DrawerContextProvider>
                <FilesContextProvider>
                    <MainPage />
                </FilesContextProvider>
            </DrawerContextProvider>
        </MainPanelContextProvider>
    );
}

export default App;
