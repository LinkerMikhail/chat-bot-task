import { Box, Paper, Typography } from "@mui/material";

type propTypes = {
    message: string,
    isSender: boolean,
};

const ChatMessage = ({ message, isSender }: propTypes) => {
    return (
        <Box
            display="flex"
            justifyContent={isSender ? 'flex-end' : 'flex-start'}
            mb={1}
        >
            <Paper
                elevation={1}
                sx={{
                    padding: '8px 16px',
                    maxWidth: '60%',
                    borderRadius: 2,
                    backgroundColor: isSender ? '#f1f1f1' : '#007bff',
                    color: isSender ? 'black' : 'white',
                }}
            >
                <Typography variant="body1">
                    {message}
                </Typography>
            </Paper>
        </Box>
    );
};

export default ChatMessage;
