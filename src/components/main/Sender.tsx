import {Box, Button, TextField} from "@mui/material";
import React from "react";

type propTypes = {
    sendMessage: () => void
    message: string,
    handleTypeMessage: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
    disableButton: boolean
}

const Sender = ({sendMessage, message, handleTypeMessage, disableButton}: propTypes) => {

    const handlePressEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !disableButton) {
            sendMessage();
        }
    };

    return (
        <Box
            p={2}
            boxSizing={'border-box'}
            height={105}
            sx={{backgroundColor: '#e6ebeb'}}
            width={'100%'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
        >
            <TextField
                label={'Enter your message'}
                sx={{mr: 5}}
                fullWidth
                value={message}
                onChange={handleTypeMessage}
                onKeyDown={handlePressEnter}
            />
            <Button
                disabled={disableButton}
                sx={{width: 120}}
                variant={'contained'}
                onClick={sendMessage}
            >
                Send
            </Button>
        </Box>
    );
};

export default Sender;
