import { Edit, Trash2, Package, ToggleLeft, ToggleRight, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AutoSellRule } from "@/types/autosell.types";

interface AutoSellListProps {
  rules: AutoSellRule[];
  onEdit: (rule: AutoSellRule) => void;
  onDelete: (rule: AutoSellRule) => void;
  onToggle: (rule: AutoSellRule) => void;
  onManageStock: (rule: AutoSellRule) => void;
}

const deliveryTypeLabels: Record<string, string> = {
  fixed: "固定内容",
  stock: "库存发货",
  api: "API 发货",
};

const triggerOnLabels: Record<string, string> = {
  paid: "支付后",
  confirmed: "确认后",
};

export function AutoSellList({
  rules,
  onEdit,
  onDelete,
  onToggle,
  onManageStock,
}: AutoSellListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">规则列表</h2>
        <Badge variant="secondary" className="rounded-full">
          {rules.length} 条规则
        </Badge>
      </div>

      {rules.length === 0 ? (
        <div className="stat-card flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Package className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg">暂无自动发货规则</p>
          <p className="text-sm mt-1">在左侧表单中添加您的第一条规则</p>
        </div>
      ) : (
        <>
          {/* 桌面端表格 */}
          <div className="hidden md:block stat-card p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>规则名称</TableHead>
                  <TableHead>发货方式</TableHead>
                  <TableHead>触发时机</TableHead>
                  <TableHead className="text-center">库存</TableHead>
                  <TableHead className="text-center">状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{rule.name}</p>
                        {rule.itemSpecification && (
                          <p className="text-xs text-muted-foreground">
                            规格：{rule.itemSpecification}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {deliveryTypeLabels[rule.deliveryType]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {triggerOnLabels[rule.triggerOn]}
                    </TableCell>
                    <TableCell className="text-center">
                      {rule.deliveryType === "stock" ? (
                        <span className="text-sm">
                          <span className="text-green-600 font-medium">
                            {(rule.stockCount || 0) - (rule.usedCount || 0)}
                          </span>
                          <span className="text-muted-foreground">
                            /{rule.stockCount || 0}
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggle(rule)}
                        className={cn(
                          "gap-1",
                          rule.enabled ? "text-green-600" : "text-muted-foreground"
                        )}
                      >
                        {rule.enabled ? (
                          <>
                            <ToggleRight className="w-4 h-4" />
                            启用
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4" />
                            禁用
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {rule.deliveryType === "stock" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onManageStock(rule)}
                          >
                            <Database className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(rule)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onDelete(rule)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 移动端卡片 */}
          <div className="md:hidden space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={cn("stat-card", !rule.enabled && "opacity-60")}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{rule.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {deliveryTypeLabels[rule.deliveryType]}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {triggerOnLabels[rule.triggerOn]}
                      </Badge>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      "text-xs",
                      rule.enabled
                        ? "bg-green-500/10 text-green-600 border-green-500/30"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {rule.enabled ? "启用" : "禁用"}
                  </Badge>
                </div>

                {rule.deliveryType === "stock" && (
                  <p className="text-sm text-muted-foreground mb-3">
                    库存：
                    <span className="text-green-600 font-medium">
                      {(rule.stockCount || 0) - (rule.usedCount || 0)}
                    </span>
                    /{rule.stockCount || 0}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onToggle(rule)}
                  >
                    {rule.enabled ? "禁用" : "启用"}
                  </Button>
                  {rule.deliveryType === "stock" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onManageStock(rule)}
                    >
                      库存
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onEdit(rule)}
                  >
                    编辑
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(rule)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
