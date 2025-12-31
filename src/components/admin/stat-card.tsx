"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    trend?: {
        direction: "up" | "down"
        value: string
    }
    icon?: LucideIcon
    className?: string
}

export function StatCard({
    title,
    value,
    description,
    trend,
    icon: Icon,
    className,
}: StatCardProps) {
    return (
        <div
            className={cn(
                "rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md",
                className
            )}
        >
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                {trend && (
                    <div
                        className={cn(
                            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                            trend.direction === "up"
                                ? "text-emerald-600 bg-emerald-500/10"
                                : "text-red-600 bg-red-500/10"
                        )}
                    >
                        {trend.direction === "up" ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        {trend.value}
                    </div>
                )}
            </div>
            <div className="mt-3 flex items-baseline gap-2">
                {Icon && (
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                )}
                <div className="text-3xl font-bold tracking-tight">{value}</div>
            </div>
            {description && (
                <p className="mt-2 text-xs text-muted-foreground">{description}</p>
            )}
        </div>
    )
}
