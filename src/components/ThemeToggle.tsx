/**
 * 主题切换按钮 - 太阳/月亮图标
 */

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 避免水合不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30",
          "dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20",
          className
        )}
        disabled
      >
        <span className="sr-only">切换主题</span>
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "h-10 w-10 rounded-full backdrop-blur-sm border transition-all duration-300",
        "bg-white/20 border-white/30 hover:bg-white/40 hover:scale-105",
        "dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20",
        "shadow-lg hover:shadow-xl",
        className
      )}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-300 transition-transform duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 transition-transform duration-300" />
      )}
      <span className="sr-only">切换主题</span>
    </Button>
  );
}
