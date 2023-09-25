import Link from "next/link"
import va from '@vercel/analytics';
import { Icons } from "@/components/icons"
import { Button } from "../shadui/button";

export const metadata = {
    title: "Pricing",
}

export default function PricingPage() {
    return (
        <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
            <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
                <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                    Simple, transparent pricing
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                    Unlock all features with Pro including unlimited chats, integrations and future releases.
                </p>
            </div>
            <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none">
                {/* Starter plan */}
                <div className="rounded-lg shadow-sm divide-y divide-zinc-600 bg-background">
                    <div className="p-6">
                        <h3 className="text-2xl font-semibold leading-6">Starter</h3>
                        <p className="mt-4 text-zinc-600">
                            What&apos;s included in the Starter plan
                        </p>
                        <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">

                            <li className="flex items-center">
                                <Icons.check className="mr-2 h-4 w-4" /> Limited Best AI Models (GPT-4 Quality.)
                            </li>
                            <li className="flex items-center">
                                <Icons.check className="mr-2 h-4 w-4" /> Unlimited Fast AI Models (ChatGPT AI Quality.).
                            </li>
                            <li className="flex items-center">
                                <Icons.check className="mr-2 h-4 w-4" /> Low File Upload Limits (TBD)
                            </li>
                            <li className="flex items-center">
                                <Icons.check className="mr-2 h-4 w-4" /> Limited Support
                            </li>


                        </ul>
                        <div className="mt-8">
                            <h4 className="text-5xl font-extrabold">$0</h4>
                            <br />
                        </div>
                        <Button variant='outline'>
                            <Link
                                onClick={() => {
                                    va.track('Free Plan', { location: 'pricing' });
                                }}
                                href="/galogin"

                            >
                                Get Started
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-lg shadow-sm divide-y divide-zinc-600 bg-background">
                    <div className="p-6">
                        <h3 className="text-2xl font-semibold leading-6">PRO</h3>
                        <p className="mt-4 text-zinc-600">
                            What&apos;s included in the PRO plan
                        </p>
                        <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">

                            <li className="flex items-center">
                                <Icons.check className="mr-2 h-4 w-4" /> Best AI Models (GPT-4 Quality.)
                            </li>
                            <li className="flex items-center">
                                <Icons.check className="mr-2 h-4 w-4" /> New capabilities will be added at no extra cost.
                            </li>
                            <li className="flex items-center">
                                <Icons.check className="mr-2 h-4 w-4" /> High File Upload Limits (TBD)
                            </li>
                            <li className="flex items-center">
                                <Icons.check className="mr-2 h-4 w-4" /> Pro support
                            </li>
                        </ul>
                        <div className="mt-8">
                            <h4 className="text-5xl font-extrabold">$20</h4>
                            <p className="text-base font-medium text-background">
                                Billed Monthly
                            </p>
                        </div>
                        <Button variant='outline'>
                            <Link
                                onClick={() => {
                                    va.track('Pro Plan', { location: 'pricing', price: 20 });
                                }}
                                href="/dashboard/billing"

                            >
                                Get Started
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}