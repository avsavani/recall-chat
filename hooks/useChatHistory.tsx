import { supabase } from "@/lib/initSupabase";
import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { useStore } from "@/lib/globalState";
{/* Component for managing chat History. Includes fetchingChatThreads, updatingChatThreads, creatingChatThreads, and handling threadClicks */ }

export function useChatHistory(chatThreadId, user_id) {
    const { chatHistory, setChatHistory, chatThreads, setChatThreads, currentChatThread, setCurrentChatThread, fetchedMessages, setFetchedMessages, selectedThreadId, setSelectedThreadId } = useStore();

    const router = useRouter();

    {/* CHAT HISTORY FUNCTIONS */ }

    async function getChatHistory(user_id, chatThreadId, limit = null) {
        const chatHistoryQuery = supabase
            .from("chat_history")
            .select("*")
            .eq("thread_id", chatThreadId)
            .eq("user_id", user_id);

        if (limit) {
            chatHistoryQuery.limit(limit);
        }

        const { data: chatHistory, error: historyError } = await chatHistoryQuery.order(
            "created_at",
            { ascending: true }
        );

        if (historyError) {
            console.error("Error fetching chat history:", historyError);
            return;
        }

        return chatHistory;
    }

    async function insertChatHistory(user_id, chatThreadId, historyPair) {
        const { error } = await supabase
            .from('chat_history')
            .insert([
                {
                    user_id: user_id,
                    thread_id: chatThreadId,
                    content: historyPair,
                },
            ]);

        if (error) {
            console.error('Error inserting messages:', error);
            return;
        }
    }

    async function loadChatHistory(chatThreadId) {
        if (!user_id || !chatThreadId) return;

        const chatHistory = await getChatHistory(user_id, chatThreadId);

        let formattedMessages = [];

        for (const historyItem of chatHistory) {
            const contentArray = historyItem.content;
            if (contentArray) {
                const userMessage = contentArray.find(
                    (contentItem) => contentItem.role === "user"
                );
                const assistantMessage = contentArray.find(
                    (contentItem) => contentItem.role === "assistant"
                );

                formattedMessages.push({
                    type: "apiMessage",
                    question:
                        userMessage && userMessage.content ? userMessage.content : "",
                    message:
                        assistantMessage && assistantMessage.content
                            ? assistantMessage.content
                            : "",
                    sourceDocs: historyItem.sourceDocs || [], //
                });
            }
        }
        setFetchedMessages(formattedMessages);
    }

    // getLast10 messages from Supabase
    async function getLastFiveChats(user_id, chatThreadId) {
        const chatHistory = await getChatHistory(user_id, chatThreadId, 5);

        if (!chatHistory) {
            console.error("Error fetching last ten messages.");
            return [];
        }
        let formattedMessages = [];
        for (const historyItem of chatHistory) {
            const contentArray = historyItem.content;
            if (contentArray) {
                const userMessage = contentArray.find(
                    (contentItem) => contentItem.role === "user"
                );
                const assistantMessage = contentArray.find(
                    (contentItem) => contentItem.role === "assistant"
                );

                if (userMessage && userMessage.content) {
                    formattedMessages.push({ role: 'user', content: userMessage.content });
                }

                if (assistantMessage && assistantMessage.content) {
                    formattedMessages.push({ role: 'assistant', content: assistantMessage.content });
                }
            }
        }

        return formattedMessages;
    }

    {/* CHAT THREADS */ }

    async function createChatThread(user_id, question = "") {
        const displayName = question === "" ? "New-conversation" : question;
        const { data, error } = await supabase
            .from("chat_threads")
            .insert([{ user_id, display_name: displayName }])
            .select('*');

        if (error) {
            console.error("Error creating chat thread:", error);
            return null;
        }
        return data;
    }

    async function fetchChatThreads(user_id) {
        const { data, error } = await supabase
            .from("chat_threads")
            .select("*")
            .eq("user_id", user_id);

        if (error) {
            console.error("Error fetching chat threads:", error);
            return [];
        }

        return data
    }

    async function deleteSingleChatThread(user_id, thread_id) {
        // First, delete all chat histories related to this thread
        const { error: historyError } = await supabase
            .from("chat_history")
            .delete()
            .match({ thread_id: thread_id });

        if (historyError) {
            console.error("Error deleting chat history:", historyError);
            return { error: `Error deleting chat history: ${historyError}` };
        }

        // Then, delete the thread itself
        const { error: deleteThreadError } = await supabase
            .from("chat_threads")
            .delete()
            .eq("id", thread_id)
            .eq("user_id", user_id);

        if (deleteThreadError) {
            console.error("Error deleting chat thread:", deleteThreadError);
            return { error: `Error deleting chat thread: ${deleteThreadError}` };
        }

        return { success: true };
    }

    async function deleteAllChatThreads(user_id) {
        const { data: threads, error: threadError } = await supabase
            .from("chat_threads")
            .select("id")
            .eq("user_id", user_id);

        if (threadError) {
            console.error("Error fetching threads for deletion:", threadError);
            return { error: `Error fetching threads for deletion: ${threadError}` };
        }

        for (const thread of threads) {
            const { error: historyError } = await supabase
                .from("chat_history")
                .delete()
                .match({ thread_id: thread.id });

            if (historyError) {
                console.error("Error deleting chat history:", historyError);
                return { error: `Error deleting chat history: ${historyError}` };
            }

            const { error: deleteThreadError } = await supabase
                .from("chat_threads")
                .delete()
                .eq("id", thread.id);

            if (deleteThreadError) {
                console.error("Error deleting chat thread:", deleteThreadError);
                return { error: `Error deleting chat thread: ${deleteThreadError}` };
            }
        }

        setCurrentChatThread(null);

        setChatThreads([]);
        setChatHistory([]);
        return { success: true };
    }



    {/* CHAT THREAD UTILITY FUNCTIONS */ }



    // Update the handleCreateThread function to accept the question parameter
    async function handleCreateThread(question) {
        const newThread = await createChatThread(user_id, question);
        if (newThread) {
            const updatedThreads = [...chatThreads, newThread[0]];
            const sortedThreads = sortChatThreads(updatedThreads);
            setChatThreads(sortedThreads);
            setCurrentChatThread(newThread[0]);
            setSelectedThreadId(newThread[0].id);
            return newThread[0];
        }
    }


    const handleThreadClick = async (chatThreadId) => {
        setSelectedThreadId(chatThreadId);
        setFetchedMessages([]);
        setChatHistory([]);
        await loadChatHistory(chatThreadId);

        router.push(`/dashboard?threadId=${chatThreadId}`);
        setCurrentChatThread(chatThreads.find(thread => thread.id === chatThreadId));
    };

    const handleIconClick = async () => {
        setFetchedMessages([]);
        setChatThreads([]);
        setChatHistory([]);
        setCurrentChatThread(null);
    }


    function sortChatThreads(threads) {
        return threads.sort((a, b) => {
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });
    }


    return {
        chatHistory,
        fetchChatThreads,
        createChatThread,
        currentChatThread,
        setCurrentChatThread,
        chatThreads,
        setChatThreads,
        handleCreateThread,
        insertChatHistory,
        getChatHistory,
        deleteAllChatThreads,
        loadChatHistory,
        handleThreadClick,
        fetchedMessages,
        setSelectedThreadId,
        selectedThreadId,
        getLastFiveChats,
        setChatHistory,
        setFetchedMessages,
        sortChatThreads,
        handleIconClick,
        deleteSingleChatThread
    };
}
