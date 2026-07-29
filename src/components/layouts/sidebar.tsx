"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Target,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },   // ← fixed
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/leads", label: "Leads", icon: Target },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/employees", label: "Employees", icon: UserCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "h-screen bg-card border-r flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold">CRM Pro</h1>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      </div>
    </div>
  );
}