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
        // 浅色模式 - 与登录页面一致的渐变背景
        "bg-gradient-to-br from-background via-accent/20 to-primary/5",
        // 深色模式背景
        "dark:bg-gradient-to-br dark:from-background dark:via-accent/10 dark:to-primary/5"
      )}
    >
      {/* 背景网格效果 */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-50" />

      {/* 装饰性光晕 */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

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
