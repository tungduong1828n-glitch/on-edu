"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AreaChartProps {
    data?: number[]
    className?: string
    title?: string
    subtitle?: string
}

export function AreaChart({
    data = [30, 45, 35, 50, 40, 60, 55, 70, 65, 75, 80, 85],
    className,
    title = "Tổng lượt truy cập",
    subtitle = "Trong 30 ngày qua",
}: AreaChartProps) {
    const [activeRange, setActiveRange] = React.useState<"7d" | "30d" | "3m">("30d")

    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    const points = data
        .map((val, i) => {
            const x = (i / (data.length - 1)) * 100
            const y = 100 - ((val - min) / range) * 80 - 10
            return `${x},${y}`
        })
        .join(" ")

    const areaPoints = `0,100 ${points} 100,100`

    return (
        <div className={cn("rounded-xl border bg-card p-6", className)}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
                <div className="flex gap-1 p-1 rounded-lg bg-muted/50">
                    {(["3m", "30d", "7d"] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setActiveRange(range)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                activeRange === range
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {range === "3m" ? "3 tháng" : range === "30d" ? "30 ngày" : "7 ngày"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative h-48 w-full">
                <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="h-full w-full"
                >
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {[0, 25, 50, 75, 100].map((y) => (
                        <line
                            key={y}
                            x1="0"
                            y1={y}
                            x2="100"
                            y2={y}
                            stroke="currentColor"
                            strokeOpacity="0.1"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}

                    <polygon
                        points={areaPoints}
                        fill="url(#areaGradient)"
                        className="transition-all duration-500"
                    />

                    <polyline
                        points={points}
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        className="transition-all duration-500"
                    />
                </svg>

                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-2">
                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                        <span key={day}>{day}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}
