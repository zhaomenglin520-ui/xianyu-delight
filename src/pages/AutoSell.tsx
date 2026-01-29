import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AutoSellForm } from "@/components/autosell/AutoSellForm";
import { AutoSellList } from "@/components/autosell/AutoSellList";
import { StockDialog } from "@/components/autosell/StockDialog";
import { AutoSellRule, StockItem } from "@/types/autosell.types";

// 模拟规则数据
const mockRules: AutoSellRule[] = [
  {
    id: 1,
    name: "iPhone 卡密发货",
    enabled: true,
    itemId: "item_001",
    itemSpecification: null,
    accountId: "acc_001",
    deliveryType: "stock",
    deliveryContent: null,
    apiConfig: null,
    triggerOn: "paid",
    workflowId: null,
    stockCount: 50,
    usedCount: 23,
  },
  {
    id: 2,
    name: "会员激活码",
    enabled: true,
    itemId: "item_002",
    itemSpecification: "月卡",
    accountId: "acc_001",
    deliveryType: "fixed",
    deliveryContent: "感谢购买，您的激活码将在24小时内发送到您的邮箱",
    apiConfig: null,
    triggerOn: "confirmed",
    workflowId: null,
  },
  {
    id: 3,
    name: "API 发货测试",
    enabled: false,
    itemId: "item_003",
    itemSpecification: null,
    accountId: "acc_002",
    deliveryType: "api",
    deliveryContent: null,
    apiConfig: {
      url: "https://api.example.com/delivery",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"orderId": "{{orderId}}"}',
    },
    triggerOn: "paid",
    workflowId: null,
  },
];

// 模拟库存数据
const mockStockItems: Record<number, StockItem[]> = {
  1: [
    { id: 1, ruleId: 1, content: "ABCD-1234-EFGH-5678", used: true, usedOrderId: "order_001", createdAt: "2024-01-20", usedAt: "2024-01-25" },
    { id: 2, ruleId: 1, content: "IJKL-9012-MNOP-3456", used: true, usedOrderId: "order_002", createdAt: "2024-01-20", usedAt: "2024-01-26" },
    { id: 3, ruleId: 1, content: "QRST-7890-UVWX-1234", used: false, usedOrderId: null, createdAt: "2024-01-20", usedAt: null },
    { id: 4, ruleId: 1, content: "YZAB-5678-CDEF-9012", used: false, usedOrderId: null, createdAt: "2024-01-20", usedAt: null },
  ],
};

const AutoSell = () => {
  const [rules, setRules] = useState(mockRules);
  const [editingRule, setEditingRule] = useState<AutoSellRule | null>(null);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [selectedRuleForStock, setSelectedRuleForStock] = useState<AutoSellRule | null>(null);

  const handleEdit = (rule: AutoSellRule) => {
    setEditingRule(rule);
  };

  const handleDelete = (rule: AutoSellRule) => {
    setRules(prev => prev.filter(r => r.id !== rule.id));
    if (editingRule?.id === rule.id) {
      setEditingRule(null);
    }
  };

  const handleToggle = (rule: AutoSellRule) => {
    setRules(prev =>
      prev.map(r => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleManageStock = (rule: AutoSellRule) => {
    setSelectedRuleForStock(rule);
    setStockDialogOpen(true);
  };

  const handleSave = (rule: Partial<AutoSellRule>) => {
    if (editingRule) {
      setRules(prev =>
        prev.map(r => (r.id === editingRule.id ? { ...r, ...rule } : r))
      );
    } else {
      const newRule: AutoSellRule = {
        id: Date.now(),
        name: rule.name || "新规则",
        enabled: rule.enabled ?? true,
        itemId: rule.itemId || null,
        itemSpecification: rule.itemSpecification || null,
        accountId: rule.accountId || null,
        deliveryType: rule.deliveryType || "fixed",
        deliveryContent: rule.deliveryContent || null,
        apiConfig: rule.apiConfig || null,
        triggerOn: rule.triggerOn || "paid",
        workflowId: rule.workflowId || null,
        stockCount: 0,
        usedCount: 0,
      };
      setRules(prev => [...prev, newRule]);
    }
    setEditingRule(null);
  };

  const handleCancel = () => {
    setEditingRule(null);
  };

  const handleSaveStock = (ruleId: number, items: string[]) => {
    // 模拟保存库存
    console.log("Saving stock for rule", ruleId, items);
    setRules(prev =>
      prev.map(r =>
        r.id === ruleId ? { ...r, stockCount: items.length } : r
      )
    );
  };

  return (
    <MainLayout>
      <div className="grid gap-6 lg:grid-cols-5">
        {/* 左侧表单 */}
        <div className="lg:col-span-2">
          <AutoSellForm
            rule={editingRule}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>

        {/* 右侧规则列表 */}
        <div className="lg:col-span-3">
          <AutoSellList
            rules={rules}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onManageStock={handleManageStock}
          />
        </div>
      </div>

      {/* 库存管理弹窗 */}
      <StockDialog
        open={stockDialogOpen}
        onOpenChange={setStockDialogOpen}
        rule={selectedRuleForStock}
        stockItems={selectedRuleForStock ? mockStockItems[selectedRuleForStock.id] || [] : []}
        onSave={handleSaveStock}
      />
    </MainLayout>
  );
};

export default AutoSell;
