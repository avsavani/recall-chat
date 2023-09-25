import { RetrieveFile } from '@/components/RetrieveFiles'
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { DashboardShell } from "@/components/shell"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { useSession } from "next-auth/react";

export default function DashboardFiles() {
    const { data: session, status } = useSession();
    const loading = status === 'loading';

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <div>Please sign in</div>;
    }

    return (
        <DashboardLayout>
            <DashboardShell>
                <DashboardHeader
                    heading="Manage Data Sources"
                />
                <div className="grid gap-8">
                    <RetrieveFile />
                </div>

            </DashboardShell>
        </DashboardLayout>
    );
}
