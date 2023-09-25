import * as React from "react"
import { DashboardSidebar } from './DashboardSidebar'
import { usePathname } from "next/navigation" // Import usePathname for highlighting current route

import { SidebarNavItem } from "types"
import { cn } from "@/lib/utils"
import { useLockBody } from "@/hooks/use-lock-body"

interface MobileNavProps {
    items: SidebarNavItem[]
    children?: React.ReactNode
    userId: string
}

export function MobileNav({ userId, items, children }: MobileNavProps) {
    useLockBody()

    const path = usePathname() // Get the current path for highlighting current route

    return (
        <div
            className={cn(
                "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden"
            )}
        >
            <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
                <DashboardSidebar userId={userId} items={items} />
                {children}
            </div>
        </div>
    )
}