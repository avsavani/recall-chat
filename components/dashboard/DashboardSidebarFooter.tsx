import { cn } from '@/lib/utils'

export function SidebarFooter({
    children,
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn('flex items-center justify-between p-4', className)}
            style={{ position: "absolute", left: 0, bottom: 0 }}
            {...props}
        >
            {children}
        </div>
    )
}
