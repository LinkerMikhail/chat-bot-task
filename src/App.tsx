import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import ChatPage from "./components/main";

const App = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/chat/:chatId" element={<ChatPage/>}/>
                <Route path="*" element={<Navigate to={`/chat/${Date.now()}`}/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
