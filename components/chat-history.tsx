import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/shadui/sheet'
import ThreadContainer from "@/components/chat-history-sidebar/Sidebar"
import { useStore } from "@/lib/globalState";
import { useChatHistory } from "@/hooks/useChatHistory";
import { SidebarFooter } from "@/components/chat-history-sidebar/sidebar-footer";
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/themeSwitcher"
import { ClearHistory } from "@/components/clear-history";
import { useSession } from 'next-auth/react';
import { Icons } from "@/components/icons"

export function ChatHistory() {
    const { data: session, status } = useSession()
    const userId = session?.user.id;
    const { setCurrentChatThread, chatClicked, setChatClicked, loadingStatus } = useStore();
    const {
        fetchChatThreads,
        handleThreadClick,
        selectedThreadId,
        sortChatThreads,
    } = useChatHistory(undefined, userId);
    return (
        <>

            <Sheet key={"chat-history"}>

                <SheetTrigger asChild>
                    <div className={cn("group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer")}>
                        <Icons.History className="mr-2 h-4 w-4" />
                        <span>{"Chat History"}</span>
                    </div>
                </SheetTrigger>
                <SheetContent position="left" className="inset-y-0 flex h-auto w-[300px] flex-col p-0">
                    <SheetHeader className="p-4">
                        <SheetTitle className="text-sm">Chat History</SheetTitle>
                    </SheetHeader>
                    <ThreadContainer
                        user_id={userId}
                        setCurrentChatThread={setCurrentChatThread}
                        fetchChatThreads={fetchChatThreads}
                        handleThreadClick={handleThreadClick}
                        selectedThreadId={selectedThreadId}
                        sortChatThreads={sortChatThreads}
                        setChatClicked={setChatClicked}
                        chatClicked={chatClicked}
                        loadingStatus={loadingStatus}
                    />
                    <SidebarFooter>
                        <ClearHistory />
                    </SidebarFooter>
                </SheetContent>
            </Sheet>

        </>

    )
}
