import { Bell, LogOut, User, Wifi, MessageSquare } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
}

// 模拟状态数据
const statusData = {
  username: "管理员",
  onlineAccounts: 5,
  messageCount: 12,
};

export function Header({ title }: HeaderProps) {
  return (
    <header
      className={cn(
        "h-14 px-6 flex items-center justify-between sticky top-0 z-20",
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
        {title}
      </h1>

      {/* 右侧状态栏 */}
      <div className="flex items-center gap-1">
        {/* 当前用户 */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground dark:text-white/70">
          <User className="w-4 h-4" />
          <span>{statusData.username}</span>
        </div>

        {/* 在线账号数 */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm">
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-green-600 dark:text-green-400 font-medium">
            {statusData.onlineAccounts}
          </span>
        </div>

        {/* 消息数量 */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative h-9 px-3 rounded-lg",
            "hover:bg-black/5 dark:hover:bg-white/5"
          )}
        >
          <MessageSquare className="w-4 h-4 text-blue-500" />
          {statusData.messageCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 text-[10px] font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 border-0"
            >
              {statusData.messageCount > 99 ? "99+" : statusData.messageCount}
            </Badge>
          )}
        </Button>

        {/* 主题切换 */}
        <ThemeToggle className="h-9 w-9 rounded-lg hover:bg-black/5 dark:hover:bg-white/5" />

        {/* 通知 */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative h-9 w-9 rounded-lg",
            "hover:bg-black/5 dark:hover:bg-white/5"
          )}
        >
          <Bell className="w-4 h-4 text-muted-foreground dark:text-white/70" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </Button>

        {/* 用户菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center gap-2 px-2 h-9 rounded-lg",
                "hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-[hsl(35,90%,50%)] flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={cn(
              "w-56 mt-2",
              "bg-white/95 backdrop-blur-xl border-white/50",
              "dark:bg-[rgba(30,30,46,0.95)] dark:border-white/10"
            )}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-foreground dark:text-white">
                  {statusData.username}
                </p>
                <p className="text-xs text-muted-foreground dark:text-white/50">
                  admin@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50 dark:bg-white/10" />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>个人资料</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50 dark:bg-white/10" />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>退出登录</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
