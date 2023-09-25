// You will need to import this at the top of your file
import { BsDiscord } from "react-icons/bs"
import Link from 'next/link'
import { Button } from "./shadui/button"

export function DiscordButton() {
    return (
        <Link href="https://discord.gg/2ATNzJq56R">
            <Button variant="ghost">
                <BsDiscord className="transition-all h-4 w-4" />
                <span className="sr-only">Discord link</span>
            </Button>
        </Link>
    )
}