'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/shadui/alert-dialog'
import { useStore } from "@/lib/globalState";
import { Button } from '@/components/ui/button'
import { useSession } from "next-auth/react"
import {
    IconSpinner,
    IconTrash,
} from '@/components/ui/icons'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { useChatHistory } from '@/hooks/useChatHistory'


export function SidebarActions({

}) {
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [isRemovePending, startRemoveTransition] = React.useTransition()
    const router = useRouter()

    const { data: session, status } = useSession()
    const userId = session?.user?.id;
    const { currentChatThread } = useStore();
    const { deleteSingleChatThread } = useChatHistory(currentChatThread?.id, userId);

    return (
        <>
            <div className="space-x-1">

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-6 w-6 p-0 hover:bg-background"
                            disabled={isRemovePending}
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <IconTrash />
                            <span className="sr-only">Delete</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete chat</TooltipContent>
                </Tooltip>
            </div>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete your chat message and remove your
                            data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isRemovePending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isRemovePending}
                            onClick={event => {
                                event.preventDefault()
                                startRemoveTransition(async () => {
                                    await deleteSingleChatThread(userId, currentChatThread?.id)

                                    setDeleteDialogOpen(false)
                                    router.replace('/dashboard', {})
                                    router.refresh()
                                    toast.success('Chat deleted')
                                })
                            }}
                        >
                            {isRemovePending && <IconSpinner className="mr-2 animate-spin" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

