import OpenAI from "openai";
import {ChangeEvent} from "react";
import {SelectChangeEvent} from "@mui/material";

export type GptModelType = {
    "id": string,
    "object": string,
    "created": number,
    "owned_by": string
}

export type ChatType = {
    id: string;
    messages: Array<OpenAI.Chat.Completions.ChatCompletionMessageParam>;
}

export type ChatHookType = {
    /** Function to send the user message to the OpenAI API. */
    sendMessage: () => void;

    /** The current message being typed by the user. */
    message: string;

    /** List of messages for the selected chat session. */
    messages?: Array<OpenAI.Chat.Completions.ChatCompletionMessageParam>

    /** Handles user typing in the message input. */
    handleTypeMessage: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;

    /** State indicating if the send button should be disabled. */
    disableButton: boolean;

    /** List of available GPT models fetched from OpenAI. */
    models: Array<string>;

    /** The currently selected model for chat. */
    selectedModel: string;

    /** Handles changes to the selected model. */
    handleChangeModel: (event: SelectChangeEvent) => void;

    /** List of chat sessions. */
    chats: Array<ChatType>;

    /** The ID of the currently selected chat. */
    selectedChatId: string | null;

    /** Function to create a new chat session and return its ID. */
    createNewChat: () => string;

    /** Function to select an existing chat by its ID. */
    selectChat: (chatId: string) => void;
}