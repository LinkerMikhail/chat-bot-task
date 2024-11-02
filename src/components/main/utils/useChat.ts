import OpenAI from "openai";
import {ChangeEvent, useEffect, useMemo, useState} from "react";
import {ChatHookType, ChatType, GptModelType} from "./types.ts";
import {SelectChangeEvent} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Anthropic from "@anthropic-ai/sdk";
import {anthropicModels} from "./constants.ts";

const useChat = (): ChatHookType => {
    const openai = useMemo(() => new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    }), []);
    const anthropic = useMemo(() => new Anthropic({
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true
    }), []);
    const navigate = useNavigate();
    const {chatId} = useParams();

    const [message, setMessage] = useState("");
    const [disableButton, setDisableButton] = useState(false);
    const [models, setModels] = useState<Array<string>>(anthropicModels);
    const [selectedModel, setSelectedModel] = useState<string>(anthropicModels[0]);
    const [chats, setChats] = useState<Array<ChatType>>(() => {
        const savedChats = localStorage.getItem("chats");
        return savedChats ? JSON.parse(savedChats) : [];
    });
    const [selectedChatId, setSelectedChatId] = useState<string | null>(() => {
        const savedChatId = localStorage.getItem("selectedChatId");
        return savedChatId || (chats[0]?.id ?? null);
    });

    useEffect(() => {
        if (!selectedChatId && chats.length > 0) {
            setSelectedChatId(chats[0].id);
            localStorage.setItem("selectedChatId", chats[0].id);
        }
    }, [chats]);

    useEffect(() => {
        localStorage.setItem("chats", JSON.stringify(chats));
        if (selectedChatId) localStorage.setItem("selectedChatId", selectedChatId);
    }, [chats, selectedChatId]);

    const handleChangeModel = (event: SelectChangeEvent) => {
        setSelectedModel(event.target.value);
    };

    useEffect(() => {
        fetch("https://api.openai.com/v1/models", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const modelsList = data.data
                    .filter((model: GptModelType) => model.id.startsWith("gpt") || model.id.startsWith("chatgpt"))
                    .map((model: GptModelType) => model.id);
                setModels([...models, ...modelsList]);
            })
            .catch((error) => console.error("Error fetching models:", error));
    }, []);

    const handleTypeMessage = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const sendQueryGpt = async () => {
        if (!selectedChatId) createNewChat();
        const activeChat = chats.find((chat) => chat.id === selectedChatId);
        setDisableButton(true);
        const userMessage = message;
        setMessage("");

        setChats((prevChats) =>
            prevChats.map((chat) =>
                chat.id === selectedChatId
                    ? {
                        ...chat,
                        messages: [...chat.messages, {role: "user", content: userMessage}, {
                            role: "assistant",
                            content: ""
                        }],
                    }
                    : chat
            )
        );

        try {
            const stream = await openai.chat.completions.create({
                model: selectedModel,
                messages: [...activeChat!.messages, {role: "user", content: userMessage}],
                stream: true,
            });

            let completeMessage = "";

            for await (const chunk of stream) {
                const text = chunk.choices[0].delta.content || "";
                completeMessage += text;

                setChats((prevChats) =>
                    prevChats.map((chat) =>
                        chat.id === selectedChatId
                            ? {
                                ...chat,
                                messages: chat.messages.map((msg, idx, arr) =>
                                    idx === arr.length - 1 ? {...msg, content: completeMessage} : msg
                                ),
                            }
                            : chat
                    )
                );
            }
        } catch (error) {
            console.error("Error sending query:", error);
        } finally {
            setDisableButton(false);
        }
    };

    const sendQueryAnthropic = async () => {
        if (!selectedChatId) createNewChat();
        const activeChat = chats.find((chat) => chat.id === selectedChatId);
        setDisableButton(true);
        const userMessage = message;
        setMessage("");

        setChats((prevChats) =>
            prevChats.map((chat) => {
                    return chat.id === selectedChatId
                        ? {
                            ...chat,
                            messages: [...chat.messages, {role: "user", content: userMessage}, {
                                role: "assistant",
                                content: ""
                            }],
                        }
                        : chat
                }
            )
        );

        try {
            const response = await anthropic.messages.create({
                model: selectedModel,
                stream: true,
                max_tokens: 500,
                messages: [...activeChat!.messages as Array<Anthropic.Messages.MessageParam>, {
                    role: "user",
                    content: userMessage
                }],
            });

            let completeMessage = "";

            for await (const chunk of response) {
                let text = "";
                if ("delta" in chunk) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-expect-error
                    text = chunk?.delta.text || "";
                }

                completeMessage += text;

                setChats((prevChats) =>
                    prevChats.map((chat) =>
                        chat.id === selectedChatId
                            ? {
                                ...chat,
                                messages: chat.messages.map((msg, idx, arr) =>
                                    idx === arr.length - 1 ? {...msg, content: completeMessage} : msg
                                ),
                            }
                            : chat
                    )
                );
            }
        } catch (error) {
            console.error("Error sending query to Anthropic:", error);
        } finally {
            setDisableButton(false);
        }
    };

    const sendQuery = () => {
        if (selectedModel.startsWith("claude")) sendQueryAnthropic();
        else sendQueryGpt();
    };

    const createNewChat = (): string => {
        const id = String(Date.now());
        const newChat: ChatType = {
            id,
            messages: [],
        };
        setChats((prevChats) => [...prevChats, newChat]);
        setSelectedChatId(newChat.id);
        navigate(`/chat/${id}`);
        return newChat.id;
    };

    const selectChat = (chatId: string) => {
        const chatExists = chats.some((chat) => chat.id === chatId);
        const targetChatId = chatExists ? chatId : chats[0]?.id;

        if (targetChatId) {
            setSelectedChatId(targetChatId);
            navigate(`/chat/${targetChatId}`);
        }
    };

    useEffect(() => {
        if (chatId && chats.some((chat) => chat.id === chatId)) {
            setSelectedChatId(chatId);
        } else if (chats.length > 0) {
            selectChat(chats[0].id);
        } else createNewChat();
    }, [chatId, chats]);

    return {
        sendMessage: sendQuery,
        message,
        messages: chats.find((chat) => chat.id === selectedChatId)?.messages || [],
        handleTypeMessage,
        disableButton,
        models,
        selectedModel,
        handleChangeModel,
        chats,
        selectedChatId,
        createNewChat,
        selectChat,
    };
};

export default useChat;
