import React from 'react'
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from '@/lib/utils'
import va from '@vercel/analytics';
import Image from 'next/image';

function Hero() {

    return (
        <>
            <section className="hero-content z-10 space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
                <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">

                    <h1 className="font-heading text-5xl sm:text-5xl md:text-6xl lg:text-8xl ">
                        Your Personal Knowledge Assistant.
                    </h1>
                    <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 lg:text-3xl">
                        ChatGPT for all your data sources.
                    </p>
                    <div className="space-x-4">
                        <Link onClick={() => {
                        }} href="mailto:gautam@typefrost.com?subject=Questions about Typefrost!" className={cn(buttonVariants({ size: "lg" }))}>
                            Join the waitlist
                        </Link>

                        <Link href="mailto:gautam@typefrost.com?subject=Questions about Typefrost!" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                            Contact Us
                        </Link>

                    </div>
                </div>
            </section>
            <section
                id="features"
                className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
            >
                <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                    <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                        Features
                    </h2>
                    <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                        Turn raw data into actionable insights.
                    </p>
                </div>
                <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
                            <div className="space-y-2">
                                <h3 className="font-bold"> Data Integration</h3>
                                <p className="text-sm text-muted-foreground">
                                    Upload your data, Connect and upload from various sources like Google Drive or add to your knowledge base from webpages and YouTube.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-braces"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"></path><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"></path></svg>
                            <div className="space-y-2">
                                <h3 className="font-bold">Advanced Querying</h3>
                                <p className="text-sm text-muted-foreground">
                                    Ask questions or generate summaries from your knowledge base using state-of-the-art language models like GPT-4.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                className="h-12 w-12 fill-current"
                            >
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <div className="space-y-2">
                                <h3 className="font-bold">Authentication</h3>
                                <p className="text-sm text-muted-foreground">
                                    You control your data. Delete anytime. Secured with SOC2 and GDPR compliance.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-person-standing"><circle cx="12" cy="5" r="1"></circle><path d="m9 20 3-6 3 6"></path><path d="m6 8 6 2 6-2"></path><path d="M12 10v4"></path></svg>
                            <h3 className="font-bold">AI Driven Conversations</h3>
                            <p className="text-sm text-muted-foreground">
                                Say goodbye to document management. Chat with your knowledge base and get answers instantly.
                            </p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot"><rect width="18" height="10" x="3" y="11" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" x2="8" y1="16" y2="16"></line><line x1="16" x2="16" y1="16" y2="16"></line></svg>
                            <h3 className="font-bold">Get Sources for all your documents</h3>
                            <p className="text-sm text-muted-foreground">
                                Get sources for all your documents. No more searching for the right document.
                            </p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fffefe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-command"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path></svg>
                            <div className="space-y-2">
                                <h3 className="font-bold">Coming Soon: Github+Confluence & more</h3>
                                <p className="text-sm text-muted-foreground">
                                    We&apos;re working on integrating with your favorite tools like Github and Confluence.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <section id="join-us" className="container py-8 md:py-12 lg:py-24">
                <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
                    <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                        Be part of the Future.
                    </h2>

                </div>
            </section>

        </>
    )
}

export { Hero } 