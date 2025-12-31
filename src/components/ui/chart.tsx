"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
    [k in string]: {
        label?: React.ReactNode
        icon?: React.ComponentType
    } & (
        | { color?: string; theme?: never }
        | { color?: never; theme: Record<keyof typeof THEMES, string> }
    )
}

type ChartContextProps = {
    config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
    const context = React.useContext(ChartContext)
    if (!context) {
        throw new Error("useChart must be used within a <ChartContainer />")
    }
    return context
}

const ChartContainer = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
        config: ChartConfig
        children: React.ComponentProps<
            typeof RechartsPrimitive.ResponsiveContainer
        >["children"]
    }
>(({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId()
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

    return (
        <ChartContext.Provider value={{ config }}>
            <div
                data-chart={chartId}
                ref={ref}
                className={cn(
                    "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
                    className
                )}
                {...props}
            >
                <ChartStyle id={chartId} config={config} />
                <RechartsPrimitive.ResponsiveContainer>
                    {children}
                </RechartsPrimitive.ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
    const colorConfig = Object.entries(config).filter(
        ([, config]) => config.theme || config.color
    )

    if (!colorConfig.length) {
        return null
    }

    return (
        <style
            dangerouslySetInnerHTML={{
                __html: Object.entries(THEMES)
                    .map(
                        ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
                                .map(([key, itemConfig]) => {
                                    const color =
                                        itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
                                        itemConfig.color
                                    return color ? `  --color-${key}: ${color};` : null
                                })
                                .join("\n")}
}
`
                    )
                    .join("\n"),
            }}
        />
    )
}

const ChartTooltip = RechartsPrimitive.Tooltip

interface ChartTooltipContentProps {
    active?: boolean
    payload?: any[]
    label?: string
    labelFormatter?: (value: any, payload: any[]) => React.ReactNode
    indicator?: "line" | "dot" | "dashed"
    hideLabel?: boolean
    hideIndicator?: boolean
    className?: string
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
    (
        {
            active,
            payload,
            className,
            indicator = "dot",
            hideLabel = false,
            hideIndicator = false,
            label,
            labelFormatter,
        },
        ref
    ) => {
        const { config } = useChart()

        if (!active || !payload?.length) {
            return null
        }

        const formattedLabel = labelFormatter ? labelFormatter(label, payload) : label

        return (
            <div
                ref={ref}
                className={cn(
                    "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
                    className
                )}
            >
                {!hideLabel && formattedLabel && (
                    <div className="font-medium">{formattedLabel}</div>
                )}
                <div className="grid gap-1.5">
                    {payload.map((item: any, index: number) => {
                        const itemConfig = config[item.dataKey as keyof typeof config]
                        const indicatorColor = item.payload?.fill || item.color

                        return (
                            <div
                                key={item.dataKey || index}
                                className={cn(
                                    "flex w-full flex-wrap items-stretch gap-2",
                                    indicator === "dot" && "items-center"
                                )}
                            >
                                {!hideIndicator && (
                                    <div
                                        className={cn(
                                            "shrink-0 rounded-[2px]",
                                            indicator === "dot" && "h-2.5 w-2.5",
                                            indicator === "line" && "w-1 h-full"
                                        )}
                                        style={{ backgroundColor: indicatorColor }}
                                    />
                                )}
                                <div className="flex flex-1 justify-between items-center leading-none">
                                    <span className="text-muted-foreground">
                                        {itemConfig?.label || item.name || item.dataKey}
                                    </span>
                                    {item.value !== undefined && (
                                        <span className="font-mono font-medium tabular-nums text-foreground">
                                            {item.value.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
)
ChartTooltipContent.displayName = "ChartTooltip"

export {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartStyle,
}
