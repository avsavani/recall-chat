'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { IconMoon, IconSun } from '@/components/ui/icons'

export function ModeToggle() {
    const { setTheme, theme } = useTheme()
    const [_, startTransition] = React.useTransition()

    return (
        <Button
            variant="ghost"
            onClick={() => {
                startTransition(() => {
                    setTheme(theme === 'light' ? 'dark' : 'light')
                })
            }}
        >
            {!theme ? null : theme === 'dark' ? (
                <IconMoon className="transition-all  h-4 w-4" />
            ) : (
                <IconSun className="transition-all  h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}