import { ShieldAlert, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Forbidden = () => {
  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center relative overflow-hidden",
        // 浅色模式渐变
        "bg-gradient-to-br from-[#f3e8ff] via-[#e0e7ff] to-[#fce7f3]",
        // 深色模式渐变
        "dark:bg-gradient-to-br dark:from-[#1a0a2e] dark:via-[#16213e] dark:to-[#0f3460]"
      )}
    >
      {/* 网格背景 */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "bg-[linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)]",
          "dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]",
          "bg-[size:20px_20px]"
        )}
      />

      {/* 装饰性光晕 */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* 内容 */}
      <div className="relative z-10 text-center px-4">
        {/* 图标 */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* 错误代码 */}
        <h1 className="text-8xl font-bold text-red-500 mb-4">403</h1>

        {/* 标题 */}
        <h2 className="text-2xl font-semibold text-foreground dark:text-white mb-2">
          禁止访问
        </h2>

        {/* 描述 */}
        <p className="text-muted-foreground dark:text-white/60 mb-8 text-lg">
          你知道的太多了 🤫
        </p>

        {/* 返回按钮 */}
        <Button
          asChild
          className={cn(
            "gap-2 px-6 py-5 rounded-xl text-base font-medium",
            "bg-gradient-to-r from-primary to-[hsl(35,90%,50%)]",
            "hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200",
            "shadow-[0_4px_20px_rgba(var(--primary),0.3)]"
          )}
        >
          <Link to="/">
            <Home className="w-5 h-5" />
            返回首页
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Forbidden;
