import { useCallback, useEffect, lazy, Suspense } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { useSession } from "next-auth/react";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useRouter } from 'next/router';
import { useStore } from "@/lib/globalState";
import { ChatSkeleton } from "@/components/chat-skeleton";
import mixpanel from "@/lib/initMixpanel";
import { mix } from "framer-motion";
const Chat = lazy(() => import('@/components/query/Chat'));


export default function DashboardPage() {
    const { data: session, status } = useSession();
    const user_id = session?.user.id;
    const loading = status === 'loading';

    const { currentChatThread, setCurrentChatThread, fetchedMessages, chatClicked, setChatClicked, loadingStatus, setLoadingStatus } = useStore();

    const {
        handleCreateThread,
        loadChatHistory
    } = useChatHistory(undefined, user_id);

    const router = useRouter();
    const threadId = router.query.threadId;

    const loadChatHistoryCallback = useCallback((threadId) => {
        loadChatHistory(threadId);
    }, []);

    useEffect(() => {
        if (threadId) {
            loadChatHistoryCallback(threadId);
        }
    }, [threadId, loadChatHistoryCallback]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <div>Please sign in</div>;
    }

    return (
        <DashboardLayout>
            <Suspense fallback={<ChatSkeleton />}>
                <Chat user_id={session.user.id}
                    chatThreadId={threadId}
                    currentChatThread={currentChatThread}
                    handleCreateThread={handleCreateThread}
                    fetchedMessages={fetchedMessages}
                    setCurrentChatThread={setCurrentChatThread}
                    chatClicked={chatClicked}
                    setChatClicked={setChatClicked}
                    setLoadingStatus={setLoadingStatus}
                    loadingStatus={loadingStatus}
                />
            </Suspense>
        </DashboardLayout>
    );
}
