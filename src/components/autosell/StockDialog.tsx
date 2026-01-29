import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AutoSellRule, StockItem } from "@/types/autosell.types";

interface StockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: AutoSellRule | null;
  stockItems: StockItem[];
  onSave: (ruleId: number, items: string[]) => void;
}

export function StockDialog({
  open,
  onOpenChange,
  rule,
  stockItems,
  onSave,
}: StockDialogProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (open && stockItems.length > 0) {
      // 只显示未使用的库存
      const availableItems = stockItems
        .filter((item) => !item.used)
        .map((item) => item.content)
        .join("\n");
      setContent(availableItems);
    } else {
      setContent("");
    }
  }, [open, stockItems]);

  const handleSave = () => {
    if (rule) {
      const items = content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      onSave(rule.id, items);
      onOpenChange(false);
    }
  };

  const lines = content
    .split("\n")
    .filter((line) => line.trim().length > 0);
  const usedCount = stockItems.filter((item) => item.used).length;
  const totalCount = lines.length + usedCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>管理库存 - {rule?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 统计信息 */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">{totalCount}</p>
              <p className="text-xs text-muted-foreground">总数量</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-600">{lines.length}</p>
              <p className="text-xs text-muted-foreground">可用</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-muted-foreground">{usedCount}</p>
              <p className="text-xs text-muted-foreground">已使用</p>
            </div>
          </div>

          {/* 库存内容 */}
          <div>
            <Label htmlFor="stockContent">库存内容（每行一个）</Label>
            <Textarea
              id="stockContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="输入库存内容，每行一个&#10;例如：&#10;ABCD-1234-EFGH-5678&#10;IJKL-9012-MNOP-3456"
              className="mt-1 font-mono text-sm"
              rows={10}
            />
          </div>

          {/* 已使用的库存提示 */}
          {usedCount > 0 && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <p className="text-sm text-amber-600">
                注意：已有 {usedCount} 条库存已被使用，这些不会显示在编辑区域中。
              </p>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
