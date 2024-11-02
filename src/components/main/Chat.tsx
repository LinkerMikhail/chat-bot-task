import {Box} from "@mui/material";
import ChatMessage from "./ChatMessage.tsx";
import OpenAI from "openai";

type propTypes = {
    messages?: Array<OpenAI.Chat.Completions.ChatCompletionMessageParam>
}

const Chat = ({messages}: propTypes) => {


    return (
        <Box p={2} boxSizing={'border-box'} width={'100%'} overflow={'auto'} height={'75%'}>
            {messages?.map((item, key) => <ChatMessage key={key} message={item.content as string} isSender={item.role === 'user'}/>)}
        </Box>
    );
};

export default Chat;