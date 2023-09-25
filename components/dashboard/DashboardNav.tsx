"use client"
import * as React from "react"
import Link from "next/link"
import { SidebarNavItem } from "types"
import { Icons } from "@/components/icons"
import { MobileNav } from "./mobile-nav"
import { dashboardConfig } from "@/config/dashboard"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/globalState";
import { useRouter } from "next/router"
interface MainNavProps {
    items?: SidebarNavItem[]
    children?: React.ReactNode
    userId: string
}

export function DashboardNav({ userId, items, children }: MainNavProps) {
    const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)
    const { loadingStatus } = useStore();
    const router = useRouter()
    return (
        <div className="flex gap-6 md:gap-10 ">
            <Link href={loadingStatus === 'loading' ? router.asPath : "/dashboard"} className="hidden items-center space-x-2 md:flex">
                <Icons.brain />
                <span className="hidden font-bold sm:inline-block">
                    {siteConfig.name}
                </span>
            </Link>

            {/* <ModeToggle /> */}
            {items?.length ? (
                <nav className="hidden gap-6 md:flex">
                    {items?.map((item, index) => (
                        <Link
                            key={index}
                            href={item.disabled ? "#" : item.href}
                            className={cn(
                                "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                                item.href.startsWith(`/}`)
                                    ? "text-foreground"
                                    : "text-foreground/60",
                                item.disabled && "cursor-not-allowed opacity-80"
                            )}
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>
            ) : null}
            <button
                className="flex items-center space-x-2 md:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
                {showMobileMenu ? <Icons.close /> : <Icons.brain />}
                <span className="font-bold">Menu</span>
            </button>
            {showMobileMenu && <MobileNav userId={userId} items={dashboardConfig.sidebarNav}>{children}</MobileNav>}
        </div>
    )
}