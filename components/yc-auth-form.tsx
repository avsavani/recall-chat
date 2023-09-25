"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { YCUserAuthSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons"
import { FcGoogle } from "react-icons/fc"
import { useRouter } from 'next/router';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

type FormData = z.infer<typeof YCUserAuthSchema>

export function YCUserAuthForm({ className, ...props }: UserAuthFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(YCUserAuthSchema),
    })
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)
    const searchParams = useSearchParams()
    const router = useRouter();

    async function onSubmit(data: FormData) {
        setIsLoading(true)

        try {
            const signInResult = await signIn("credentials", {
                username: data.email.toLowerCase(),
                password: data.password,
                redirect: false,
                callbackUrl: searchParams?.get("from") || "/dashboard",
            })

            setIsLoading(false)

            if (signInResult.ok) {
                router.push(signInResult.url || "/dashboard");
            }

            if (!signInResult?.ok) {
                toast({
                    title: "Something went wrong.",
                    description: "Your sign in request failed. Please try again.",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Logged in",
                description: "Succesfully logged in.",
            });
        } catch (error) {
            toast({
                title: "Something went wrong.",
                description: "Your sign in request failed. Please try again.",
                variant: "destructive",
            });
            console.error('Sign in error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading || isGitHubLoading}
                            {...register("email")}
                        />
                        <Label className="sr-only" htmlFor="password">
                            Password
                        </Label>
                        <Input
                            id="password"
                            placeholder="••••••••••••"
                            type="password"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={isLoading || isGitHubLoading}
                            {...register("password")}
                        />
                        {errors?.email && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <button className={cn(buttonVariants())} disabled={isLoading}>
                        {isLoading && (
                            <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign In with Email
                    </button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <button
                type="button"
                className={cn(buttonVariants({ variant: "outline" }))}
                onClick={() => {
                    setIsGitHubLoading(true)
                    signIn("google")
                }}
                disabled={isLoading || isGitHubLoading}
            >
                {isGitHubLoading ? (
                    <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <FcGoogle className="mr-2 h-4 w-4" />
                )}{" "}
                Sign in with Google
            </button>

        </div>
    )
}