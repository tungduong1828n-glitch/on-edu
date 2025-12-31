"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
    value: string
    onValueChange: (value: string) => void
    children: React.ReactNode
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string
    children: React.ReactNode
}

interface SelectValueProps {
    placeholder?: string
}

const SelectContext = React.createContext<{
    value: string
    onValueChange: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
} | null>(null)

function useSelectContext() {
    const context = React.useContext(SelectContext)
    if (!context) {
        throw new Error("Select components must be used within a Select")
    }
    return context
}

export function Select({ value, onValueChange, children }: SelectProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
            <div className="relative">
                {children}
            </div>
        </SelectContext.Provider>
    )
}

export function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
    const { open, setOpen } = useSelectContext()

    return (
        <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
                "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", open && "rotate-180")} />
        </button>
    )
}

export function SelectValue({ placeholder }: SelectValueProps) {
    const { value } = useSelectContext()

    const displayLabels: Record<string, string> = {
        "90d": "3 tháng",
        "30d": "30 ngày",
        "7d": "7 ngày",
    }

    return (
        <span>{value ? displayLabels[value] || value : placeholder}</span>
    )
}

export function SelectContent({ className, children, ...props }: SelectContentProps) {
    const { open, setOpen } = useSelectContext()
    const ref = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [open, setOpen])

    if (!open) return null

    return (
        <div
            ref={ref}
            className={cn(
                "absolute right-0 top-full z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export function SelectItem({ value, className, children, ...props }: SelectItemProps) {
    const { value: selectedValue, onValueChange, setOpen } = useSelectContext()
    const isSelected = value === selectedValue

    return (
        <div
            className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                isSelected && "bg-accent",
                className
            )}
            onClick={() => {
                onValueChange(value)
                setOpen(false)
            }}
            {...props}
        >
            {children}
        </div>
    )
}
