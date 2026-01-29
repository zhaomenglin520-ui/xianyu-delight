import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  MessageCircle,
  Truck,
  GitBranch,
  Bot,
  Bell,
  MessageSquare,
  FileText,
  Zap,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Fish,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
      { title: "对话消息", icon: MessageCircle, path: "/conversations", badge: 12 },
    ],
  },
  {
    title: "自动化配置",
    items: [
      { title: "自动发货", icon: Truck, path: "/auto-ship" },
      { title: "发货流程", icon: GitBranch, path: "/ship-workflow" },
      { title: "自动回复", icon: Bot, path: "/auto-reply" },
      { title: "通知渠道", icon: Bell, path: "/notification-channels" },
      { title: "消息通知", icon: MessageSquare, path: "/notifications" },
    ],
  },
  {
    title: "智能管理",
    items: [
      { title: "系统日志", icon: FileText, path: "/logs" },
      { title: "智能设置", icon: Zap, path: "/ai-settings" },
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

const SIDEBAR_COLLAPSED_KEY = "sidebar_collapsed";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return saved === "true";
  });
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    navGroups.map((g) => g.title)
  );
  const location = useLocation();

  // 持久化折叠状态
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  }, [collapsed]);

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
        "h-screen flex flex-col border-r transition-all duration-200 sticky top-0",
        // 浅色模式 - 玻璃拟态
        "bg-white/40 backdrop-blur-[20px] backdrop-saturate-[180%] border-white/50",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
        // 深色模式
        "dark:bg-[rgba(30,30,46,0.6)] dark:backdrop-blur-[12px] dark:backdrop-saturate-100",
        "dark:border-white/10 dark:shadow-none",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo 区域 */}
      <div className="h-14 flex items-center gap-3 px-4 border-b border-white/30 dark:border-white/10 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[hsl(35,90%,50%)] flex items-center justify-center flex-shrink-0 shadow-lg">
          <Fish className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <span className="font-bold text-foreground text-sm whitespace-nowrap">
              闲鱼智能管理
            </span>
          </div>
        )}
      </div>

      {/* 导航菜单 */}
      <ScrollArea className="flex-1 py-3">
        <nav className="px-2 space-y-3">
          {navGroups.map((group) => {
            const isExpanded = expandedGroups.includes(group.title);
            const hasActiveItem = group.items.some(
              (item) => location.pathname === item.path
            );

            return (
              <div key={group.title} className="space-y-0.5">
                {/* 分组标题 */}
                {!collapsed && (
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded-lg transition-colors duration-200",
                      "text-muted-foreground/70 hover:text-foreground hover:bg-black/5",
                      "dark:text-white/40 dark:hover:text-white/80 dark:hover:bg-white/5",
                      hasActiveItem && "text-primary dark:text-primary"
                    )}
                  >
                    <span>{group.title}</span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200",
                        !isExpanded && "-rotate-90"
                      )}
                    />
                  </button>
                )}

                {/* 导航项 */}
                {(collapsed || isExpanded) && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          title={collapsed ? item.title : undefined}
                          className={cn(
                            "group relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200",
                            collapsed ? "justify-center" : "",
                            isActive
                              ? [
                                  // 激活状态 - 渐变背景
                                  "bg-gradient-to-r from-[rgba(102,126,234,0.35)] to-[rgba(118,75,162,0.3)]",
                                  "text-foreground dark:text-white font-medium",
                                  "shadow-[0_2px_8px_rgba(102,126,234,0.3)]",
                                  // 左侧渐变边框
                                  "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2",
                                  "before:w-[3px] before:h-[60%] before:rounded-full",
                                  "before:bg-gradient-to-b before:from-[#667eea] before:to-[#764ba2]",
                                ]
                              : [
                                  "text-muted-foreground hover:text-foreground",
                                  "dark:text-white/60 dark:hover:text-white",
                                  "hover:bg-black/5 dark:hover:bg-white/5",
                                  "hover:translate-x-0.5",
                                ]
                          )}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          {!collapsed && (
                            <>
                              <span className="text-sm truncate flex-1">
                                {item.title}
                              </span>
                              {/* 未读消息徽章 */}
                              {item.badge && item.badge > 0 && (
                                <Badge
                                  variant="destructive"
                                  className="h-5 min-w-[20px] px-1.5 text-[10px] font-semibold bg-gradient-to-r from-red-500 to-pink-500 border-0"
                                >
                                  {item.badge > 99 ? "99+" : item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                          {/* 折叠时的徽章 */}
                          {collapsed && item.badge && item.badge > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[10px] text-white flex items-center justify-center font-semibold">
                              {item.badge > 9 ? "9+" : item.badge}
                            </span>
                          )}
                          {/* 折叠时激活指示器 */}
                          {collapsed && isActive && (
                            <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-primary" />
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
      <div className="p-2 border-t border-white/30 dark:border-white/10 flex-shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-200",
            "text-muted-foreground hover:text-foreground",
            "dark:text-white/50 dark:hover:text-white",
            "hover:bg-black/5 dark:hover:bg-white/5",
            "active:scale-[0.98]"
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
