import { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { YCUserAuthForm } from "@/components/yc-auth-form"

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
}

export default function YCLoginPage() {
    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <Link
                href="/"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute left-4 top-4 md:left-8 md:top-8"
                )}
            >
                <>
                    <Icons.chevronLeft className="mr-2 h-4 w-4" />
                    Back
                </>
            </Link>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <Icons.brain className="mx-auto h-6 w-6" />
                    <h1 className="text-2xl font-semibold tracking-tight">
                        HI YC!
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Please enter the email and password provided in the application to sign in.
                    </p>
                </div>
                <YCUserAuthForm />
                <p className="px-8 text-center text-sm text-muted-foreground">
                    <Link
                        href="/garegister"
                        className="hover:text-brand underline underline-offset-4"
                    >
                        Don&apos;t have an account? Sign Up
                    </Link>
                </p>
            </div>
        </div>
    )
}