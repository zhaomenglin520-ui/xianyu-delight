import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  MessageSquare,
  Truck,
  GitBranch,
  MessageCircle,
  Bell,
  Mail,
  FileText,
  Cpu,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Fish,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

// 导航分组配置
const navGroups = [
  {
    title: "仪表系统",
    items: [
      { title: "仪表盘", icon: LayoutDashboard, path: "/" },
    ],
  },
  {
    title: "业务管理",
    items: [
      { title: "账号管理", icon: Users, path: "/accounts" },
      { title: "商品管理", icon: Package, path: "/products" },
      { title: "订单管理", icon: ShoppingCart, path: "/orders" },
      { title: "对话消息", icon: MessageSquare, path: "/conversations" },
    ],
  },
  {
    title: "自动化配置",
    items: [
      { title: "自动发货", icon: Truck, path: "/auto-ship" },
      { title: "发货流程", icon: GitBranch, path: "/ship-workflow" },
      { title: "自动回复", icon: MessageCircle, path: "/auto-reply" },
      { title: "通知渠道", icon: Bell, path: "/notification-channels" },
      { title: "消息通知", icon: Mail, path: "/notifications" },
    ],
  },
  {
    title: "智能管理",
    items: [
      { title: "系统日志", icon: FileText, path: "/logs" },
      { title: "智能设置", icon: Cpu, path: "/ai-settings" },
    ],
  },
  {
    title: "系统设置",
    items: [
      { title: "用户管理", icon: UserCog, path: "/user-management" },
      { title: "全局设置", icon: Settings, path: "/settings" },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    navGroups.map((g) => g.title)
  );
  const location = useLocation();

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  return (
    <aside
      className={cn(
        "h-screen flex flex-col border-r transition-all duration-300 sticky top-0",
        "bg-card/80 backdrop-blur-xl border-border/50",
        "dark:bg-sidebar/90 dark:border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo 区域 */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-border/50 dark:border-sidebar-border flex-shrink-0">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg">
          <Fish className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <span className="font-bold text-foreground dark:text-sidebar-foreground text-base whitespace-nowrap">
              闲鱼智能管理
            </span>
          </div>
        )}
      </div>

      {/* 导航菜单 */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-4">
          {navGroups.map((group) => {
            const isExpanded = expandedGroups.includes(group.title);
            const hasActiveItem = group.items.some(
              (item) => location.pathname === item.path
            );

            return (
              <div key={group.title} className="space-y-1">
                {/* 分组标题 */}
                {!collapsed && (
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-colors",
                      "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                      "dark:text-sidebar-muted dark:hover:text-sidebar-foreground dark:hover:bg-sidebar-accent/50",
                      hasActiveItem && "text-primary dark:text-sidebar-primary"
                    )}
                  >
                    <span>{group.title}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        !isExpanded && "-rotate-90"
                      )}
                    />
                  </button>
                )}

                {/* 导航项 */}
                {(collapsed || isExpanded) && (
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          title={collapsed ? item.title : undefined}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                            "text-muted-foreground hover:text-foreground",
                            "dark:text-sidebar-foreground/70 dark:hover:text-sidebar-foreground",
                            collapsed ? "justify-center" : "",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-md dark:bg-sidebar-primary dark:text-sidebar-primary-foreground"
                              : "hover:bg-accent/60 dark:hover:bg-sidebar-accent"
                          )}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          {!collapsed && (
                            <span className="animate-fade-in text-sm truncate">
                              {item.title}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* 折叠按钮 */}
      <div className="p-3 border-t border-border/50 dark:border-sidebar-border flex-shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200",
            "text-muted-foreground hover:text-foreground hover:bg-accent/60",
            "dark:text-sidebar-muted dark:hover:text-sidebar-foreground dark:hover:bg-sidebar-accent"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">收起菜单</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
