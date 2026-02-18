import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  MessageCircle,
  Upload,
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
  Fish,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// 导航菜单配置 - 按文档要求
const navItems = [
  { title: "仪表系统", icon: LayoutDashboard, path: "/" },
  { title: "账号管理", icon: Users, path: "/accounts" },
  { title: "商品管理", icon: Package, path: "/products" },
  { title: "订单管理", icon: ShoppingCart, path: "/orders" },
  { title: "对话消息", icon: MessageCircle, path: "/conversations", badge: 12 },
  { title: "自动发货", icon: Upload, path: "/auto-ship" },
  { title: "发货流程", icon: GitBranch, path: "/ship-workflow" },
  { title: "自动回复", icon: Bot, path: "/auto-reply" },
  { title: "通知渠道", icon: Bell, path: "/notification-channels" },
  { title: "消息通知", icon: MessageSquare, path: "/notifications" },
  { title: "系统日志", icon: FileText, path: "/logs" },
  { title: "智能设置", icon: Zap, path: "/ai-settings" },
  { title: "用户管理", icon: UserCog, path: "/user-management" },
  { title: "全局设置", icon: Settings, path: "/settings" },
];

const SIDEBAR_COLLAPSED_KEY = "sidebar_collapsed";

interface SidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "hidden md:flex h-screen flex-col fixed left-0 top-0 z-30",
        "transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
        // 浅色模式 - 暖白玻璃拟态
        "bg-white/50 backdrop-blur-[24px] backdrop-saturate-[180%]",
        "border-r border-white/60",
        "shadow-[2px_0_20px_rgba(0,0,0,0.06),inset_-1px_0_0_rgba(255,255,255,0.7)]",
        // 深色模式
        "dark:bg-[rgba(28,20,14,0.65)] dark:backdrop-blur-[16px]",
        "dark:border-r dark:border-white/8 dark:shadow-[2px_0_20px_rgba(0,0,0,0.4)]",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo 区域 */}
      <div className="h-14 flex items-center gap-3 px-4 border-b border-white/40 dark:border-white/8 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl gradient-warm flex items-center justify-center flex-shrink-0 shadow-orange">
          <Fish className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <span className="text-lg font-semibold text-foreground dark:text-white whitespace-nowrap">
              闲鱼智能管理系统
            </span>
          </div>
        )}
      </div>

      {/* 导航菜单 */}
      <ScrollArea className="flex-1 py-3">
        <nav className="px-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.title : undefined}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl",
                  "transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? [
                        // 激活状态 - 暖橙渐变背景
                        "bg-gradient-to-r from-primary/20 to-primary/10",
                        "text-primary dark:text-primary font-medium",
                        "shadow-[0_2px_12px_hsl(var(--primary)/0.2)]",
                        // 左侧暖橙边框
                        "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2",
                        "before:w-[3px] before:h-[60%] before:rounded-full",
                        "before:gradient-warm before:bg-gradient-to-b before:from-primary before:to-primary/70",
                      ]
                    : [
                        "text-muted-foreground hover:text-foreground",
                        "dark:text-white/60 dark:hover:text-white",
                        "hover:bg-primary/5 dark:hover:bg-white/5",
                        "hover:translate-x-0.5",
                      ]
                )}
              >
                <item.icon className="w-6 h-6 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="text-base truncate flex-1">
                      {item.title}
                    </span>
                    {/* 未读消息徽章 */}
                    {item.badge && item.badge > 0 && (
                      <Badge
                        className="h-5 min-w-[20px] px-1.5 text-[10px] font-semibold gradient-warm text-white border-0"
                      >
                        {item.badge > 99 ? "99+" : item.badge}
                      </Badge>
                    )}
                  </>
                )}
                {/* 折叠时的徽章 */}
                {collapsed && item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-warm text-[10px] text-white flex items-center justify-center font-semibold">
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
        </nav>
      </ScrollArea>

      {/* 折叠按钮 */}
      <div className="p-2 border-t border-white/40 dark:border-white/8 flex-shrink-0">
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl",
            "transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
            "text-muted-foreground hover:text-primary",
            "dark:text-white/50 dark:hover:text-primary",
            "hover:bg-primary/8 dark:hover:bg-white/5",
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

// 导出给移动端导航使用
export { navItems };
