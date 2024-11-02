import {Box, IconButton} from "@mui/material";
import {ChatType} from "./utils/types.ts";

type propType = {
    chats: Array<ChatType>;
    selectedChatId: string | null;
    selectChat: (chatId: string) => void;
    createNewChat: () => void;
}

const Sidebar = ({chats, selectedChatId, selectChat, createNewChat}: propType) => {



    return (
        <Box height={'100%'} width={'20%'} borderRight={'1px solid black'}>

            <Box p={2} fontSize={'1.2rem'} borderBottom={'1px solid black'}> Previous Chats</Box>
            <IconButton onClick={createNewChat} sx={{
                width: '100%',
                mt: 2,
                borderRadius: 0,
            }}>
                <Box>New Chat</Box>
            </IconButton>
            <Box height={500} overflow={'auto'} p={2}>
                {chats.map((chat, index) => {
                    const selected = selectedChatId === chat.id;
                    return <IconButton

                        onClick={() => {
                            selectChat(chat.id)
                        }}
                        sx={{
                            width: '100%',
                            borderRadius: 0,
                            p: 0,
                            boxSizing: 'border-box'
                        }} key={chat.id}><Box color={selected ? '#fff' : '#000'} borderRadius={'6px'} p={1}
                                              boxSizing={'border-box'} sx={{
                        backgroundColor: selected ? '#007bff' : 'transparent',
                    }} textAlign={'left'} width={'100%'}>Chat {index + 1}</Box></IconButton>
                })}
            </Box>
        </Box>
    );
};

export default Sidebar;