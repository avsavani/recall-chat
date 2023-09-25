import { BillingForm } from "@/components/billing-form"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import useSWR from "swr";

export const metadata = {
    title: "Billing",
    description: "Manage billing and your subscription plan.",
}

export default function BillingPage() {
    const fetcher = (url: string, options?: RequestInit) => fetch(url, options).then(res => res.json())
    const { data, error } = useSWR('/api/getUserSubscription', fetcher)
    if (error) return <div>Failed to load data</div>
    if (!data) return <div>Loading...</div>

    return (
        <DashboardLayout>
            <DashboardShell>
                <DashboardHeader
                    heading="Billing"
                    text="Manage billing and your subscription plan."
                />
                <div className="grid gap-10">

                    <BillingForm
                        subscriptionPlan={{
                            ...data?.subscriptionPlan,
                            isCanceled: data?.isCanceled,
                        }}
                    />

                </div>
            </DashboardShell>
        </DashboardLayout>
    );
}


