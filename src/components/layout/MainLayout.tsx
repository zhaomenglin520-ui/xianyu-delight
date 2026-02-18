import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSED_KEY = "sidebar_collapsed";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      return saved === "true";
    }
    return false;
  });

  // 持久化折叠状态
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen w-full relative">
      {/* 背景渐变 - 暖橙色系 */}
      <div
        className={cn(
          "fixed inset-0 -z-20",
          // 浅色模式 - 暖橙渐变
          "bg-gradient-to-br from-[#fff7ed] via-[#ffedd5] via-40% to-[#fef3c7]",
          // 深色模式渐变
          "dark:bg-gradient-to-br dark:from-[#1c1208] dark:via-[#1e1408] dark:via-50% dark:to-[#1c1a08]"
        )}
      />

      {/* 网格背景 - 24px × 24px */}
      <div
        className={cn(
          "fixed inset-0 -z-10 pointer-events-none",
          // 浅色模式 - 橙调白色网格
          "bg-[linear-gradient(rgba(251,146,60,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.08)_1px,transparent_1px)]",
          // 深色模式 - 极淡网格
          "dark:bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]",
          "bg-[size:24px_24px]"
        )}
      />

      {/* 装饰性暖光晕 */}
      <div className="fixed top-0 right-0 w-[520px] h-[520px] rounded-full blur-[130px] pointer-events-none -z-10 bg-primary/10" />
      <div className="fixed bottom-0 left-1/4 w-[420px] h-[420px] rounded-full blur-[110px] pointer-events-none -z-10 bg-primary/[0.12]" />
      <div className="fixed top-1/2 left-0 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none -z-10 bg-primary/[0.07]" />

      {/* 侧边栏 - 桌面端显示 */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* 顶部栏 */}
      <Topbar sidebarCollapsed={sidebarCollapsed} />

      {/* 主内容区 */}
      <main
        className={cn(
          "min-h-screen pt-14 pb-16 md:pb-0",
          "transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
          // 响应侧边栏宽度
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        <div className="p-4 md:p-6">{children}</div>
      </main>

      {/* 移动端底部导航 */}
      <MobileNav />
    </div>
  );
}
