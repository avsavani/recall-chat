import { useSession } from "next-auth/react"
import { notFound } from "next/navigation"
import { dashboardConfig } from "@/config/dashboard"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { UserAccountNav } from "@/components/user-account-nav"
import { Separator } from "@/components/shadui/separator"
import { DashboardNav } from "./DashboardNav"


interface DashboardLayoutProps {
    children?: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { data: session, status } = useSession()

    if (!session && status !== "loading") {
        return notFound()
    }

    if (status === "loading") {
        return <div>Loading...</div>
    }

    return (
        <div className="flex min-h-screen flex-col space-y-6">
            <header className="sticky top-0 z-40 border-b bg-background w-full">
                <div className="flex p-8 h-12 items-center justify-between py-4 mx-auto">
                    <DashboardNav userId={session.user.id} />
                    <UserAccountNav
                        user={{
                            name: session.user.name,
                            image: session.user.image,
                            email: session.user.email,
                        }}
                    />
                </div>
            </header>

            <div className="container grid flex-1 gap-16 2xl:gap-24 md:grid-cols-[200px,auto,1fr] justify-start md:-ml-5">
                <aside className="hidden w-[200px] flex-col md:flex md:ml-5">
                    <DashboardSidebar userId={session.user.id} items={dashboardConfig.sidebarNav} />
                </aside>
                <Separator orientation="vertical" className="mx-auto my-auto hidden md:flex" />

                <main className="flex flex-1 flex-col overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}