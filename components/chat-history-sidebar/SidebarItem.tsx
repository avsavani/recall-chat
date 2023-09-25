import { IconMessage, IconUsers } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { buttonVariants } from "../shadui/button";
import { useRouter } from 'next/router'
import { SidebarActions } from "./sidebar-actions";

export default function ThreadItem({
    thread,
    loadingStatus,
    setCurrentChatThread,
    setChatClicked,
    chatClicked,
    handleThreadClick,
    selectedThreadId,
}) {
    const router = useRouter()
    const isActive = router.query.threadId === thread.id;

    return (
        <div className="relative">
            <div className="absolute left-2 top-1 flex h-6 w-6 items-center justify-center">
                <IconMessage className="mr-2" />
            </div>

            <div
                onClick={loadingStatus !== "loading" ? async () => {
                    setChatClicked(true)
                    await handleThreadClick(thread.id);
                    await setCurrentChatThread(thread);
                } : null}
                className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'group w-full pl-8 pr-16 cursor-pointer',
                    isActive && 'bg-accent',
                    loadingStatus === "loading" && 'cursor-not-allowed opacity-80'
                )}
            >
                <div className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
                    title={thread["display_name"]}
                >
                    <span className="whitespace-nowrap">{thread["display_name"]}</span>
                </div>

            </div>
            {isActive && <div className="absolute right-2 top-1"><SidebarActions /></div>}
        </div>
    )
}