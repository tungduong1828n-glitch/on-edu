"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar } from "@/components/ui/avatar"
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    Settings,
    HelpCircle,
    Search,
    LogOut,
    ChevronLeft,
    GraduationCap,
    Database,
    BarChart3,
    PenTool,
    MoreHorizontal,
} from "lucide-react"

interface SidebarProps {
    collapsed?: boolean
    onCollapse?: (collapsed: boolean) => void
    activeSection: string
    onSectionChange: (section: string) => void
    onLogout: () => void
}

const mainNavItems = [
    { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { id: "subjects", label: "Môn học", icon: BookOpen },
    { id: "content", label: "Nội dung", icon: FileText },
    { id: "exams", label: "Đề thi", icon: PenTool },
]

const documentNavItems = [
    { id: "data-library", label: "Thư viện dữ liệu", icon: Database },
    { id: "reports", label: "Báo cáo", icon: BarChart3 },
    { id: "more", label: "Thêm", icon: MoreHorizontal },
]

export function AdminSidebar({
    collapsed = false,
    onCollapse,
    activeSection,
    onSectionChange,
    onLogout,
}: SidebarProps) {
    const pathname = usePathname()

    return (
        <aside
            className={cn(
                "flex flex-col h-full bg-card/50 border-r transition-all duration-300",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm">EduAdmin</span>
                                <span className="text-xs text-muted-foreground">Dashboard</span>
                            </div>
                        )}
                    </Link>
                    {onCollapse && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onCollapse(!collapsed)}
                        >
                            <ChevronLeft
                                className={cn(
                                    "h-4 w-4 transition-transform",
                                    collapsed && "rotate-180"
                                )}
                            />
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2">
                {!collapsed && (
                    <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Trang chính
                    </p>
                )}
                <nav className="space-y-1">
                    {mainNavItems.map((item) => (
                        <Button
                            key={item.id}
                            variant={activeSection === item.id ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start gap-3",
                                collapsed && "justify-center px-2"
                            )}
                            onClick={() => onSectionChange(item.id)}
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </Button>
                    ))}
                </nav>

                <Separator className="my-4" />

                {!collapsed && (
                    <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Tài liệu
                    </p>
                )}
                <nav className="space-y-1">
                    {documentNavItems.map((item) => (
                        <Button
                            key={item.id}
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
                                collapsed && "justify-center px-2"
                            )}
                            disabled
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </Button>
                    ))}
                </nav>
            </div>

            <div className="mt-auto border-t p-3 space-y-1">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
                        collapsed && "justify-center px-2"
                    )}
                >
                    <Settings className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Cài đặt</span>}
                </Button>
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
                        collapsed && "justify-center px-2"
                    )}
                >
                    <HelpCircle className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Trợ giúp</span>}
                </Button>
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
                        collapsed && "justify-center px-2"
                    )}
                >
                    <Search className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Tìm kiếm</span>}
                </Button>

                <Separator className="my-2" />

                <div
                    className={cn(
                        "flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors",
                        collapsed && "justify-center"
                    )}
                >
                    <Avatar fallback="AD" className="h-8 w-8" />
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Admin</p>
                            <p className="text-xs text-muted-foreground truncate">
                                admin@example.com
                            </p>
                        </div>
                    )}
                </div>

                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10",
                        collapsed && "justify-center px-2"
                    )}
                    onClick={onLogout}
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Đăng xuất</span>}
                </Button>
            </div>
        </aside>
    )
}
