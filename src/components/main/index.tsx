import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import useChat from "./utils/useChat.ts";
import Chat from "./Chat.tsx";
import Sender from "./Sender.tsx";
import Sidebar from "./Sidebar.tsx";


const ChatPage = () => {

    const {
        sendMessage,
        message,
        handleTypeMessage,
        disableButton,
        chats,
        messages,
        models,
        selectedModel,
        handleChangeModel,
        selectedChatId,
        selectChat,
        createNewChat,
    } = useChat();


    return (
        <Box height="100vh" width="100%" display="flex">
            <Sidebar selectChat={selectChat} createNewChat={createNewChat} selectedChatId={selectedChatId}
                     chats={chats}/>
            <Box width="80%">
                <Box fontSize="1.2rem" sx={{backgroundColor: "#e6ebeb"}} borderBottom="1px solid black" p={2}>
                    My Candidate AI Chat
                </Box>
                <Box fontSize="1.2rem" sx={{backgroundColor: "#e6ebeb"}} borderBottom="1px solid black" p={2}>
                    <FormControl size="small">
                        <InputLabel id="select-model-label">Model</InputLabel>
                        <Select
                            sx={{width: 200}}
                            labelId="select-model-label"
                            id="select-model"
                            value={selectedModel}
                            label="Model"
                            onChange={handleChangeModel}
                        >
                            {models.map((item) => (
                                <MenuItem value={item} key={item}>
                                    {item}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Chat messages={messages}/>
                <Sender message={message} sendMessage={sendMessage} handleTypeMessage={handleTypeMessage}
                        disableButton={disableButton}/>
            </Box>
        </Box>
    );
};

export default ChatPage;