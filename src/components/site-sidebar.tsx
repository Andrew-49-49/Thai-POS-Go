
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
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

function ConnectionStatus() {
    const [status, setStatus] = React.useState<"checking" | "connected" | "error">("checking");

    React.useEffect(() => {
        const checkConnection = async () => {
            try {
                // We can check the connection by sending a request to the pantry base URL
                // This doesn't fetch any specific basket, just checks if the pantry exists and is reachable.
                const response = await fetch(`https://getpantry.cloud/apiv1/pantry/${process.env.NEXT_PUBLIC_PANTRY_ID}`);
                if (response.ok) {
                    setStatus("connected");
                } else {
                    setStatus("error");
                }
            } catch (error) {
                setStatus("error");
            }
        };
        checkConnection();
    }, []);

    const statusConfig = {
        checking: { color: "bg-yellow-500", tooltip: "Checking connection..." },
        connected: { color: "bg-green-500", tooltip: "Connected to Database" },
        error: { color: "bg-red-500", tooltip: "Connection Error" },
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className={cn("h-3 w-3 rounded-full", statusConfig[status].color)} />
            </TooltipTrigger>
            <TooltipContent>
                <p>{statusConfig[status].tooltip}</p>
            </TooltipContent>
        </Tooltip>
    )
}


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
                <ConnectionStatus />
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
