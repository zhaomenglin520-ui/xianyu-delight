import { Plus, Upload, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { label: "发布商品", icon: Plus, variant: "default" as const },
  { label: "批量上架", icon: Upload, variant: "secondary" as const },
  { label: "导出数据", icon: Download, variant: "secondary" as const },
  { label: "同步订单", icon: RefreshCw, variant: "secondary" as const },
];

export function QuickActions() {
  return (
    <div className="stat-card">
      <h3 className="font-semibold text-foreground mb-4">快捷操作</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            className="h-auto py-3 flex flex-col gap-2"
          >
            <action.icon className="w-5 h-5" />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
