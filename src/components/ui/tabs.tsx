"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{ value: string, setValue: (v: string) => void }>({ value: "", setValue: () => { } })

const Tabs = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { defaultValue: string, value?: string, onValueChange?: (value: string) => void }
>(({ className, defaultValue, value: controlledValue, onValueChange, children, ...props }, ref) => {
    const [value, setValue] = React.useState(defaultValue)

    const handleValueChange = (newValue: string) => {
        setValue(newValue)
        onValueChange?.(newValue)
    }

    const activeValue = controlledValue !== undefined ? controlledValue : value

    return (
        <TabsContext.Provider value={{ value: activeValue, setValue: handleValueChange }}>
            <div
                ref={ref}
                className={cn("w-full", className)}
                {...props}
            >
                {children}
            </div>
        </TabsContext.Provider>
    )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, onClick, ...props }, ref) => {
    const { value: activeValue, setValue } = React.useContext(TabsContext)
    const isActive = activeValue === value

    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50 hover:text-foreground",
                className
            )}
            onClick={(e) => {
                onClick?.(e)
                setValue(value)
            }}
            {...props}
        />
    )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
    const { value: activeValue } = React.useContext(TabsContext)

    if (value !== activeValue) return null

    return (
        <div
            ref={ref}
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            {...props}
        />
    )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
