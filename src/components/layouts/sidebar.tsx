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
  LogOut,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
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
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div
      className={cn(
        "h-screen bg-card border-r flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo area */}
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-black font-bold text-sm">CP</span>
          </div>
          {!collapsed && <span className="text-xl font-bold">CRM Pro</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                "hover:bg-accent hover:pl-4 group",
                isActive
                  ? "bg-accent text-accent-foreground border-l-2 border-primary pl-[calc(0.75rem-2px)]"
                  : "text-muted-foreground border-l-2 border-transparent"
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  "transition-colors",
                  isActive
                    ? "text-primary"
                    : "group-hover:text-foreground"
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User dropdown – FIXED: removed asChild, styling on trigger directly */}
      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 w-full rounded-lg hover:bg-accent p-2 transition-colors cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="text-left flex-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {user?.email}
                </p>
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? (
                <Sun className="mr-2 h-4 w-4" />
              ) : (
                <Moon className="mr-2 h-4 w-4" />
              )}
              Theme
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}