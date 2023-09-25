import Link from "next/link"
import va from '@vercel/analytics';
import { mainConfig } from "@/config/main"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/landing-page/landing-nav"
import { SiteFooter } from "@/components/landing-page/site-footer"
import React from "react";



interface MainLayoutProps {
    children: React.ReactNode
}

function MainLayout({
    children,
}: MainLayoutProps) {
    return (
        <div className="main-layout flex min-h-screen flex-col">
            <header className="container z-40 bg-background">
                <div className="flex h-20 items-center justify-between py-6">
                    <MainNav items={mainConfig.mainNav} />
                    <nav>
                        <Link
                            onClick={() => {
                                va.track('Signup');
                            }}
                            href="/login"
                            className={cn(
                                buttonVariants({ variant: "ghost", size: "sm" }),
                                "px-4"
                            )}
                        >
                            Login
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1">{children}</main>
            <SiteFooter />
        </div>
    )
}


export { MainLayout }