import { useSession } from "next-auth/react";
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { DangerZone } from "@/components/user-name-form"
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const metadata = {
    title: "Settings",
    description: "Manage account and website settings.",
}

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const { data: session, status } = useSession();


    if (status === "loading" || !user) {
        return <div>Loading...</div> // or your custom loading animation here
    }

    return (
        <DashboardLayout>
            <DashboardShell>
                <DashboardHeader
                    heading="Settings"
                    text="Manage account and website settings."
                />
                <div className="grid gap-10">
                    <DangerZone user={{ id: user.id, name: user.name || "" }} />
                </div>
            </DashboardShell>
        </DashboardLayout>
    )
}