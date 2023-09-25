'use client'

import * as React from 'react'
import { useChatHistory } from '@/hooks/useChatHistory'
import { toast } from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { ServerActionResult } from '@/types'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/shadui/alert-dialog'
import { IconSpinner } from '@/components/ui/icons'



export function ClearHistory() {
    const [open, setOpen] = React.useState(false)
    const [isPending, startTransition] = React.useTransition()
    const { deleteAllChatThreads } = useChatHistory(undefined, undefined)

    const { data: session, status } = useSession();
    const user_id = session?.user.id;
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" disabled={isPending}>
                    {isPending && <IconSpinner className="mr-2" />}
                    Clear history
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete your chat history and remove your data
                        from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isPending}
                        onClick={event => {
                            event.preventDefault()
                            startTransition(async () => {
                                const result = await deleteAllChatThreads(user_id)

                                if (result && 'error' in result) {
                                    toast.error(result.error)
                                    return
                                }

                                setOpen(false)

                            })
                        }}
                    >
                        {isPending && <IconSpinner className="mr-2 animate-spin" />}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}