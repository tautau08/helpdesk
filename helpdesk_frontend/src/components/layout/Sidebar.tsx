"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  Ticket,
  Users,
  Shield,
  Building2,
  FolderKanban,
  Network,
  Tag,
  Tags,
  Circle,
  Flag,
  Wrench,
  Route,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["Administrator", "Employee", "User"],
  },
  {
    label: "All Tickets",
    href: "/tickets",
    icon: Ticket,
    roles: ["Administrator", "Employee"],
  },
  {
    label: "My Tickets",
    href: "/tickets/my-tickets",
    icon: UserCheck,
    roles: ["Administrator", "Employee", "User"],
  },
  {
    label: "Create Ticket",
    href: "/tickets/create",
    icon: Plus,
    roles: ["Administrator", "Employee", "User"],
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
    roles: ["Administrator"],
  },
  {
    label: "Roles",
    href: "/roles",
    icon: Shield,
    roles: ["Administrator"],
  },
  {
    label: "Companies",
    href: "/companies",
    icon: Building2,
    roles: ["Administrator", "Employee"],
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
    roles: ["Administrator", "Employee"],
  },
  {
    label: "Departments",
    href: "/departments",
    icon: Network,
    roles: ["Administrator"],
  },
  {
    label: "Categories",
    href: "/categories",
    icon: Tag,
    roles: ["Administrator", "Employee", "User"],
  },
  {
    label: "Subcategories",
    href: "/subcategories",
    icon: Tags,
    roles: ["Administrator", "Employee", "User"],
  },
  {
    label: "Statuses",
    href: "/statuses",
    icon: Circle,
    roles: ["Administrator"],
  },
  {
    label: "Priorities",
    href: "/priorities",
    icon: Flag,
    roles: ["Administrator"],
  },
  {
    label: "Service Types",
    href: "/service-types",
    icon: Wrench,
    roles: ["Administrator"],
  },
  {
    label: "Escalation Matrix",
    href: "/escalation-matrix",
    icon: Route,
    roles: ["Administrator", "Employee"],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["Administrator"],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  // Map backend role names to our role names
  const roleMapping: Record<string, string> = {
    "ADMIN": "Administrator",
    "Administrator": "Administrator",
    "EMPLOYEE": "Employee",
    "Employee": "Employee",
    "USER": "User",
    "User": "User",
    "CLIENT": "User",
    "Client": "User",
  };

  const userRole = user?.roleName ? roleMapping[user.roleName] || user.roleName : "";

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col relative",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-white"></div>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Helpdesk</h2>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mx-auto">
            <div className="w-5 h-5 rounded-full bg-white"></div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-l-4 border-primary"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-5 h-5")} />
                  {!collapsed && (
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "h-12 flex items-center justify-center border-t border-gray-200 hover:bg-gray-50 transition-colors",
          collapsed ? "px-2" : "px-4"
        )}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ChevronLeft className="w-4 h-4" />
            <span>Collapse</span>
          </div>
        )}
      </button>
    </aside>
  );
}
