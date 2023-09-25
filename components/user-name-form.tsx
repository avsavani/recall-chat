import * as React from "react";
import { useRouter } from "next/router";
import { User } from "@prisma/client"
import { toast } from "@/components/shadui/use-toast";
import { Icons } from "@/components/icons";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/shadui/card";
import { Button } from "./shadui/button";

interface DangerZoneProps extends React.HTMLAttributes<HTMLFormElement> {
    user: Pick<User, "id" | "name">
}

export function DangerZone({ user, className, ...props }: DangerZoneProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

    async function deleteAccount() {
        setIsDeleting(true);

        const response = await fetch(`/api/deleteAccount`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: user.id }), // send the user id as part of the request body
        });

        setIsDeleting(false);

        if (!response?.ok) {
            return toast({
                title: "Something went wrong.",
                description: "Your account was not deleted. Please try again.",
                variant: "destructive",
            });
        }

        toast({
            description: "Your account has been deleted.",
        });


    }

    return (
        <form
            className={className}
            onSubmit={deleteAccount}
            {...props}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription>
                        This action will delete your account. Please proceed with caution.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-red-600">You're about to delete your account.</div>
                </CardContent>
                <CardFooter>
                    <Button variant="destructive">
                        {isDeleting && (
                            <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <span>Delete your account</span>
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}