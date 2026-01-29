import { LogOut, User, Wifi, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TopbarProps {
  sidebarCollapsed: boolean;
}

// 模拟状态数据
const statusData = {
  username: "管理员",
  onlineAccounts: 5,
  messageCount: 12,
};

export function Topbar({ sidebarCollapsed }: TopbarProps) {
  return (
    <header
      className={cn(
        "h-14 px-6 flex items-center justify-between fixed top-0 right-0 z-20",
        "transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
        // 响应侧边栏宽度
        sidebarCollapsed ? "md:left-16" : "md:left-64",
        "left-0",
        // 浅色模式 - 玻璃拟态
        "bg-white/40 backdrop-blur-[20px] backdrop-saturate-[180%]",
        "border-b border-white/30",
        "shadow-[inset_0_-1px_0_rgba(255,255,255,0.3)]",
        // 深色模式
        "dark:bg-[rgba(30,30,46,0.5)] dark:backdrop-blur-[12px] dark:backdrop-saturate-100",
        "dark:border-white/10 dark:shadow-none"
      )}
    >
      {/* 左侧标题 */}
      <h1 className="text-lg font-semibold text-foreground dark:text-white">
        欢迎使用闲鱼管理系统
      </h1>

      {/* 右侧状态栏 */}
      <div className="flex items-center gap-1">
        {/* 当前用户 */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-muted-foreground dark:text-white/70">
          <User className="w-4 h-4" />
          <span>{statusData.username}</span>
        </div>

        {/* 在线账号数 */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm">
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-green-600 dark:text-green-400 font-medium">
            {statusData.onlineAccounts}
          </span>
        </div>

        {/* 消息数量 */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {statusData.messageCount}
          </span>
        </div>

        {/* 主题切换 */}
        <ThemeToggle className="h-9 w-9 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-transform duration-200 hover:-translate-y-px" />

        {/* 退出登录按钮 */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 px-3 rounded-xl gap-2",
            "text-muted-foreground hover:text-destructive",
            "dark:text-white/70 dark:hover:text-red-400",
            "hover:bg-black/5 dark:hover:bg-white/5",
            "transition-all duration-200 hover:-translate-y-px"
          )}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">退出登录</span>
        </Button>
      </div>
    </header>
  );
}
