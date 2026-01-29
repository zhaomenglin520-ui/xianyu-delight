import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AutoReplyForm } from "@/components/autoreply/AutoReplyForm";
import { AutoReplyList } from "@/components/autoreply/AutoReplyList";
import { AutoReplyRule } from "@/types/autoreply.types";

// 模拟规则数据
const mockRules: AutoReplyRule[] = [
  {
    id: 1,
    name: "价格咨询自动回复",
    enabled: true,
    priority: 1,
    matchType: "contains",
    matchPattern: "多少钱,价格,便宜",
    replyContent: "您好，商品价格已经是最低价了，感谢您的关注！",
    excludeMatch: false,
    itemMatchType: "all",
    delaySeconds: 3,
    delayMode: "smart",
    smartDelaySecondsPerChar: 0.1,
  },
  {
    id: 2,
    name: "发货咨询",
    enabled: true,
    priority: 2,
    matchType: "contains",
    matchPattern: "发货,快递,物流",
    replyContent: "您好，拍下后24小时内发货，默认顺丰快递。",
    excludeMatch: false,
    itemMatchType: "onsale",
    delaySeconds: 5,
    delayMode: "fixed",
  },
  {
    id: 3,
    name: "AI智能回复",
    enabled: false,
    priority: 10,
    matchType: "ai",
    excludeMatch: true,
    itemMatchType: "all",
    delaySeconds: 2,
    delayMode: "smart",
    smartDelaySecondsPerChar: 0.15,
  },
];

const AutoReply = () => {
  const [rules, setRules] = useState(mockRules);
  const [editingRule, setEditingRule] = useState<AutoReplyRule | null>(null);

  const handleEdit = (rule: AutoReplyRule) => {
    setEditingRule(rule);
  };

  const handleDelete = (rule: AutoReplyRule) => {
    setRules(prev => prev.filter(r => r.id !== rule.id));
    if (editingRule?.id === rule.id) {
      setEditingRule(null);
    }
  };

  const handleToggle = (rule: AutoReplyRule) => {
    setRules(prev =>
      prev.map(r => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleSave = (rule: Partial<AutoReplyRule>) => {
    if (editingRule) {
      // 更新
      setRules(prev =>
        prev.map(r => (r.id === editingRule.id ? { ...r, ...rule } : r))
      );
    } else {
      // 创建
      const newRule: AutoReplyRule = {
        id: Date.now(),
        name: rule.name || "新规则",
        enabled: rule.enabled ?? true,
        priority: rule.priority ?? 99,
        matchType: rule.matchType || "contains",
        matchPattern: rule.matchPattern,
        replyContent: rule.replyContent,
        excludeMatch: rule.excludeMatch ?? false,
        itemMatchType: rule.itemMatchType || "all",
        delaySeconds: rule.delaySeconds ?? 3,
        delayMode: rule.delayMode || "fixed",
        smartDelaySecondsPerChar: rule.smartDelaySecondsPerChar,
      };
      setRules(prev => [...prev, newRule]);
    }
    setEditingRule(null);
  };

  const handleCancel = () => {
    setEditingRule(null);
  };

  return (
    <MainLayout>
      <div className="grid gap-6 lg:grid-cols-5">
        {/* 左侧表单 */}
        <div className="lg:col-span-2">
          <AutoReplyForm
            rule={editingRule}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>

        {/* 右侧规则列表 */}
        <div className="lg:col-span-3">
          <AutoReplyList
            rules={rules}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default AutoReply;
