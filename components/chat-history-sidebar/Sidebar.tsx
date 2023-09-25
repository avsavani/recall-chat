"use client";
import { useState, useEffect } from "react";
import ThreadItem from "./SidebarItem";

const useSortedChatThreads = (fetchChatThreads, user_id, sortChatThreads) => {
    const [sortedThreads, setSortedThreads] = useState([]);

    useEffect(() => {
        const fetchAndSortChatThreads = async () => {
            const threads = await fetchChatThreads(user_id);
            const sorted = sortChatThreads(threads);
            setSortedThreads(sorted);
        };

        fetchAndSortChatThreads();
    }, [fetchChatThreads, user_id, sortChatThreads]);

    return sortedThreads;
};

export default function ThreadContainer({
    user_id,
    fetchChatThreads,
    setCurrentChatThread,
    handleThreadClick,
    selectedThreadId,
    sortChatThreads,
    chatClicked,
    setChatClicked,
    loadingStatus,
}) {
    const chatThreads = useSortedChatThreads(fetchChatThreads, user_id, sortChatThreads);

    return (
        <div className="flex-1 overflow-auto">
            {chatThreads.length !== 0 ? chatThreads.map((thread) => (
                <ThreadItem
                    thread={thread}
                    loadingStatus={loadingStatus}
                    setCurrentChatThread={setCurrentChatThread}
                    setChatClicked={setChatClicked}
                    chatClicked={chatClicked}
                    handleThreadClick={handleThreadClick}
                    selectedThreadId={selectedThreadId}
                    key={thread.id}
                />
            )) : (
                <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">No chat history</p>
                </div>
            )}

        </div>
    );
}
