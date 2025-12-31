"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
    src?: string
    alt?: string
    fallback?: string
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
    ({ className, src, alt, fallback, ...props }, ref) => {
        const [hasError, setHasError] = React.useState(false)

        return (
            <span
                ref={ref}
                className={cn(
                    "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
                    className
                )}
                {...props}
            >
                {src && !hasError ? (
                    <img
                        src={src}
                        alt={alt || "Avatar"}
                        className="aspect-square h-full w-full object-cover"
                        onError={() => setHasError(true)}
                    />
                ) : (
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium text-sm">
                        {fallback || alt?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                )}
            </span>
        )
    }
)
Avatar.displayName = "Avatar"

export { Avatar }
