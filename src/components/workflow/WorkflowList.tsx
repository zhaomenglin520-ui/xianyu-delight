import { Plus, Edit, Trash2, Star, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Workflow } from "@/types/workflow.types";

interface WorkflowListProps {
  workflows: Workflow[];
  onCreate: () => void;
  onEdit: (workflow: Workflow) => void;
  onDelete: (workflow: Workflow) => void;
  onSetDefault: (workflow: Workflow) => void;
}

export function WorkflowList({
  workflows,
  onCreate,
  onEdit,
  onDelete,
  onSetDefault,
}: WorkflowListProps) {
  return (
    <div className="space-y-4">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-foreground">发货流程</h1>
          <Badge variant="secondary" className="rounded-full">
            {workflows.length} 个流程
          </Badge>
        </div>
        <Button onClick={onCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          新建流程
        </Button>
      </div>

      {/* 流程列表 */}
      {workflows.length === 0 ? (
        <div className="stat-card flex flex-col items-center justify-center py-16 text-muted-foreground">
          <GitBranch className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg">暂无发货流程</p>
          <p className="text-sm mt-1">点击上方按钮创建您的第一个流程</p>
          <Button onClick={onCreate} className="mt-4 gap-2">
            <Plus className="w-4 h-4" />
            创建流程
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className={cn(
                "stat-card group cursor-pointer relative",
                "hover:border-primary/30 hover:shadow-md",
                "transition-all duration-200",
                workflow.isDefault && "border-primary/50 ring-1 ring-primary/20"
              )}
            >
              {/* 默认标识 */}
              {workflow.isDefault && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    默认
                  </Badge>
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* 图标 */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center flex-shrink-0">
                  <GitBranch className="w-6 h-6 text-primary" />
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {workflow.name}
                  </h3>
                  {workflow.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {workflow.description}
                    </p>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => onEdit(workflow)}
                >
                  <Edit className="w-3.5 h-3.5" />
                  编辑
                </Button>
                {!workflow.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => onSetDefault(workflow)}
                  >
                    <Star className="w-3.5 h-3.5" />
                    设为默认
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(workflow)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
