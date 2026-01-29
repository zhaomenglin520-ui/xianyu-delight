import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen flex w-full",
        // 浅色模式渐变 - 与提示词一致
        "bg-gradient-to-br from-[#f3e8ff] via-[#e0e7ff] via-50% via-[#ddd6fe] to-[#fce7f3]",
        // 深色模式渐变
        "dark:bg-gradient-to-br dark:from-[#1a0a2e] dark:via-[#16213e] dark:via-50% dark:via-[#0f3460] dark:to-[#0d3320]"
      )}
    >
      {/* 网格背景 */}
      <div
        className={cn(
          "fixed inset-0 pointer-events-none",
          "bg-[linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)]",
          "dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]",
          "bg-[size:20px_20px]"
        )}
      />

      {/* 装饰性光晕 */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-1/2 left-0 w-[300px] h-[300px] bg-[#764ba2]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* 侧边栏 */}
      <Sidebar />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header title={title} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
