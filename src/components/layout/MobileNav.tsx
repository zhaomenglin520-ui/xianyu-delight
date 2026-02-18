import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  MessageCircle,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// 移动端底部导航项 - 精简版
const mobileNavItems = [
  { title: "仪表盘", icon: LayoutDashboard, path: "/" },
  { title: "账号", icon: Users, path: "/accounts" },
  { title: "订单", icon: ShoppingCart, path: "/orders" },
  { title: "消息", icon: MessageCircle, path: "/conversations", badge: 12 },
  { title: "设置", icon: Settings, path: "/settings" },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-30",
        "h-16 flex items-stretch",
        // 浅色模式 - 暖白玻璃拟态
        "bg-white/75 backdrop-blur-[24px] backdrop-saturate-[180%]",
        "border-t border-white/60",
        "shadow-[0_-4px_24px_rgba(0,0,0,0.07)]",
        // 深色模式
        "dark:bg-[rgba(28,20,14,0.85)] dark:backdrop-blur-[16px]",
        "dark:border-white/8"
      )}
    >
      {mobileNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 relative",
              "transition-all duration-200",
              isActive
                ? "text-primary dark:text-primary"
                : "text-muted-foreground dark:text-white/50"
            )}
          >
            <div className="relative">
              <item.icon className={cn("w-5 h-5", isActive && "scale-110")} />
              {/* 消息徽章 */}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full gradient-warm text-[9px] text-white flex items-center justify-center font-semibold">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </div>
            <span className={cn("text-[10px]", isActive && "font-medium")}>
              {item.title}
            </span>
            {/* 激活指示器 */}
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full gradient-warm" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
