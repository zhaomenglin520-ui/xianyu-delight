import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AutoReplyRule, MatchType, DelayMode, ItemMatchType } from "@/types/autoreply.types";

interface AutoReplyFormProps {
  rule: AutoReplyRule | null;
  onSave: (rule: Partial<AutoReplyRule>) => void;
  onCancel: () => void;
}

export function AutoReplyForm({ rule, onSave, onCancel }: AutoReplyFormProps) {
  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [priority, setPriority] = useState(1);
  const [matchType, setMatchType] = useState<MatchType>("contains");
  const [matchPattern, setMatchPattern] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [excludeMatch, setExcludeMatch] = useState(false);
  const [itemMatchType, setItemMatchType] = useState<ItemMatchType>("all");
  const [delaySeconds, setDelaySeconds] = useState(3);
  const [delayMode, setDelayMode] = useState<DelayMode>("fixed");
  const [smartDelayPerChar, setSmartDelayPerChar] = useState(0.1);

  useEffect(() => {
    if (rule) {
      setName(rule.name);
      setEnabled(rule.enabled);
      setPriority(rule.priority);
      setMatchType(rule.matchType);
      setMatchPattern(rule.matchPattern || "");
      setReplyContent(rule.replyContent || "");
      setExcludeMatch(rule.excludeMatch);
      setItemMatchType(rule.itemMatchType);
      setDelaySeconds(rule.delaySeconds);
      setDelayMode(rule.delayMode);
      setSmartDelayPerChar(rule.smartDelaySecondsPerChar || 0.1);
    } else {
      // 重置表单
      setName("");
      setEnabled(true);
      setPriority(1);
      setMatchType("contains");
      setMatchPattern("");
      setReplyContent("");
      setExcludeMatch(false);
      setItemMatchType("all");
      setDelaySeconds(3);
      setDelayMode("fixed");
      setSmartDelayPerChar(0.1);
    }
  }, [rule]);

  const handleSubmit = () => {
    onSave({
      name,
      enabled,
      priority,
      matchType,
      matchPattern,
      replyContent,
      excludeMatch,
      itemMatchType,
      delaySeconds,
      delayMode,
      smartDelaySecondsPerChar: delayMode === "smart" ? smartDelayPerChar : undefined,
    });
  };

  const isEditing = rule !== null;

  return (
    <div className="stat-card">
      <h3 className="font-semibold text-foreground mb-4">
        {isEditing ? "编辑规则" : "添加规则"}
      </h3>

      <div className="space-y-4">
        {/* 规则名称 */}
        <div>
          <Label htmlFor="name">规则名称 *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入规则名称"
            className="mt-1"
          />
        </div>

        {/* 启用开关 */}
        <div className="flex items-center justify-between">
          <Label htmlFor="enabled">启用规则</Label>
          <Switch
            id="enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        {/* 优先级 */}
        <div>
          <Label htmlFor="priority">优先级（数字越小优先级越高）</Label>
          <Input
            id="priority"
            type="number"
            min={1}
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
            className="mt-1"
          />
        </div>

        {/* 匹配方式 */}
        <div>
          <Label>匹配方式</Label>
          <Select value={matchType} onValueChange={(v) => setMatchType(v as MatchType)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exact">精确匹配</SelectItem>
              <SelectItem value="contains">包含关键词</SelectItem>
              <SelectItem value="regex">正则表达式</SelectItem>
              <SelectItem value="ai">AI 回复</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 匹配模式 - 非AI时显示 */}
        {matchType !== "ai" && (
          <>
            <div className="flex items-center justify-between">
              <Label htmlFor="excludeMatch">排除匹配（匹配其他规则未匹配的消息）</Label>
              <Switch
                id="excludeMatch"
                checked={excludeMatch}
                onCheckedChange={setExcludeMatch}
              />
            </div>

            {!excludeMatch && (
              <div>
                <Label htmlFor="matchPattern">
                  {matchType === "exact" ? "匹配关键词" : matchType === "contains" ? "包含关键词（逗号分隔）" : "正则表达式"}
                </Label>
                <Input
                  id="matchPattern"
                  value={matchPattern}
                  onChange={(e) => setMatchPattern(e.target.value)}
                  placeholder={matchType === "regex" ? "输入正则表达式" : "输入关键词，多个用逗号分隔"}
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="replyContent">回复内容</Label>
              <Textarea
                id="replyContent"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="输入自动回复内容"
                className="mt-1"
                rows={4}
              />
            </div>
          </>
        )}

        {/* AI回复配置 */}
        {matchType === "ai" && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground">
              AI 回复将使用全局配置的 AI 设置。请确保在智能设置页面配置了 AI API。
            </p>
          </div>
        )}

        {/* 适用商品 */}
        <div>
          <Label>适用商品</Label>
          <Select value={itemMatchType} onValueChange={(v) => setItemMatchType(v as ItemMatchType)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有商品</SelectItem>
              <SelectItem value="onsale">在售商品</SelectItem>
              <SelectItem value="offsale">已下架商品</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 延迟设置 */}
        <div>
          <Label>延迟模式</Label>
          <Select value={delayMode} onValueChange={(v) => setDelayMode(v as DelayMode)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">固定延迟</SelectItem>
              <SelectItem value="random">随机延迟</SelectItem>
              <SelectItem value="smart">智能延迟（根据消息长度）</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="delaySeconds">延迟时间（秒）</Label>
            <Input
              id="delaySeconds"
              type="number"
              min={0}
              value={delaySeconds}
              onChange={(e) => setDelaySeconds(parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>

          {delayMode === "smart" && (
            <div>
              <Label htmlFor="smartDelay">秒/字</Label>
              <Input
                id="smartDelay"
                type="number"
                step={0.1}
                min={0.1}
                value={smartDelayPerChar}
                onChange={(e) => setSmartDelayPerChar(parseFloat(e.target.value) || 0.1)}
                className="mt-1"
              />
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSubmit} className="flex-1 gap-2">
            <Save className="w-4 h-4" />
            保存
          </Button>
          {isEditing && (
            <Button variant="outline" onClick={onCancel} className="gap-2">
              <X className="w-4 h-4" />
              取消
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
