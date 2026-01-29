import { Bell, LogOut, User, ChevronDown } from "lucide-react";
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

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header
      className={cn(
        "h-16 px-6 flex items-center justify-between sticky top-0 z-20",
        "bg-card/70 backdrop-blur-xl border-b border-border/50",
        "dark:bg-card/50 dark:border-border/30"
      )}
    >
      {/* 页面标题 */}
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>

      {/* 右侧操作区 */}
      <div className="flex items-center gap-2">
        {/* 主题切换 */}
        <ThemeToggle className="h-9 w-9" />

        {/* 通知 */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative h-9 w-9 rounded-full",
            "hover:bg-accent/60 dark:hover:bg-accent/30"
          )}
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
        </Button>

        {/* 用户菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center gap-2 px-2 h-10 rounded-full",
                "hover:bg-accent/60 dark:hover:bg-accent/30"
              )}
            >
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-foreground">
                  管理员
                </span>
                <span className="text-xs text-muted-foreground">admin</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={cn(
              "w-56 mt-2",
              "bg-popover/95 backdrop-blur-xl border-border/50",
              "dark:bg-popover/90 dark:border-border/30"
            )}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-foreground">管理员</p>
                <p className="text-xs text-muted-foreground">
                  admin@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>个人资料</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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
