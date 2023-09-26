"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarNavItem } from "types"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ChatHistory } from "../chat-history"
import mixpanel from '@/lib/initMixpanel';
import va from '@vercel/analytics';
import PlusComponent from "./PlusComponent"
import { useStore } from "@/lib/globalState";
import { useRouter } from "next/router"
import { SidebarFooter } from "./DashboardSidebarFooter";
import { ModeToggle } from "../themeSwitcher"
import { DiscordButton } from "../Discord"

interface DashboardNavProps {
    items: SidebarNavItem[]
    userId: string
}
export function DashboardSidebar({ userId, items }: DashboardNavProps) {
    const router = useRouter()
    const path = usePathname()
    const { loadingStatus } = useStore();

    if (!items?.length) {
        return null
    }

    return (
        <nav className="grid items-start gap-2 md:block">
            <div className="mb-4">
                <PlusComponent userId={userId} />
            </div>

            {items.map((item) => {
                if (item.isSeparator) {
                    return <div key={item.title} className="my-12"></div>
                } else if (item.items) {
                    return (
                        <div key={item.title} className={cn("pb-8")}>
                            <h1 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">
                                {item.title}
                            </h1>
                            {item.items.map((subItem) => {
                                const Icon = Icons[subItem.icon || "arrowRight"]
                                return (
                                    <Link key={subItem.title} href={loadingStatus === 'loading' ? router.asPath : (subItem.disabled ? "/" : subItem.href)}>
                                        <span
                                            onClick={(e) => {
                                                if (loadingStatus !== 'loading') {
                                                    va.track('Sidebar Events', { location: 'Sidebar' });
                                                    mixpanel.track('Sidebar item clicked', { item_name: subItem.title });
                                                } else {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className={cn(
                                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                                path === subItem.href ? "bg-accent" : "transparent",
                                                (subItem.disabled || loadingStatus === 'loading') && "cursor-not-allowed opacity-80"
                                            )}
                                        >
                                            <Icon className="mr-2 h-4 w-4" />
                                            <span>{subItem.title}</span>
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    )
                } else {
                    const Icon = Icons[item.icon || "arrowRight"]
                    if (item.title === "Chat History") {
                        return (
                            <ChatHistory />
                        )
                    }
                    return (
                        <Link key={item.title} href={loadingStatus === 'loading' ? router.asPath : (item.disabled ? "/" : item.href)}>
                            <span
                                className={cn(
                                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                    path === item.href ? "bg-accent" : "transparent",
                                    (item.disabled || loadingStatus === 'loading') && "cursor-not-allowed opacity-80"
                                )}
                            >
                                <Icon className="mr-2 h-4 w-4" />
                                <span>{item.title}</span>
                            </span>
                        </Link>
                    )
                }
            })}
            <br />
            <SidebarFooter >
                <ModeToggle />
                <DiscordButton />
            </SidebarFooter>
        </nav>

    )
}
