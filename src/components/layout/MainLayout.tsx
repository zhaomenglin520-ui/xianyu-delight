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
      {/* 背景渐变 */}
      <div
        className={cn(
          "fixed inset-0 -z-20",
          // 浅色模式渐变 - 按文档要求
          "bg-gradient-to-br from-[#f3e8ff] via-[#e0e7ff] via-50% via-[#ddd6fe] to-[#fce7f3]",
          // 深色模式渐变
          "dark:bg-gradient-to-br dark:from-[#1a0a2e] dark:via-[#16213e] dark:via-50% dark:via-[#0f3460] dark:to-[#0d3320]"
        )}
      />

      {/* 网格背景 - 20px × 20px */}
      <div
        className={cn(
          "fixed inset-0 -z-10 pointer-events-none",
          // 浅色模式 - 白色40%透明度
          "bg-[linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)]",
          // 深色模式 - 白色5%透明度
          "dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]",
          "bg-[size:20px_20px]"
        )}
      />

      {/* 装饰性光晕 */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#667eea]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/4 w-[400px] h-[400px] bg-[#764ba2]/15 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-0 w-[300px] h-[300px] bg-[#667eea]/8 rounded-full blur-[100px] pointer-events-none -z-10" />

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
