
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Boxes, History, LayoutDashboard, Settings, ShoppingCart, Sparkles, User, Warehouse } from "lucide-react"

import { cn } from "@/lib/utils"
import { th } from "@/lib/translations"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"

export function SiteSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/", label: th.dashboard, icon: LayoutDashboard },
    { href: "/inventory", label: th.inventory, icon: Boxes },
    { href: "/pos", label: th.pos, icon: ShoppingCart },
    { href: "/sales", label: th.sales, icon: History },
    { href: "/insights", label: th.insights, icon: Sparkles },
  ]

  return (
    <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                    <Warehouse className="w-5 h-5" />
                </div>
                <span className="text-lg font-semibold">{th.appName}</span>
            </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
            <SidebarMenu>
                {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href} passHref>
                            <SidebarMenuButton
                                isActive={pathname === item.href}
                                tooltip={item.label}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start gap-2 h-12 p-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://placehold.co/40x40" alt="User Avatar" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                         <div className="text-left group-data-[collapsible=icon]:hidden">
                            <p className="font-medium text-sm">ผู้ใช้ตัวอย่าง</p>
                            <p className="text-xs text-muted-foreground">admin@example.com</p>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                    <DropdownMenuLabel>{th.myAccount}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>{th.profile}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{th.settings}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                       <span>{th.logout}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarFooter>
    </Sidebar>
  )
}
