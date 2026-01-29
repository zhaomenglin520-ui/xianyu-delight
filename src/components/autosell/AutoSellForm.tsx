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
import { AutoSellRule, DeliveryType, TriggerOn } from "@/types/autosell.types";

interface AutoSellFormProps {
  rule: AutoSellRule | null;
  onSave: (rule: Partial<AutoSellRule>) => void;
  onCancel: () => void;
}

export function AutoSellForm({ rule, onSave, onCancel }: AutoSellFormProps) {
  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [accountId, setAccountId] = useState("");
  const [itemId, setItemId] = useState("");
  const [itemSpecification, setItemSpecification] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("fixed");
  const [deliveryContent, setDeliveryContent] = useState("");
  const [triggerOn, setTriggerOn] = useState<TriggerOn>("paid");
  const [apiUrl, setApiUrl] = useState("");
  const [apiMethod, setApiMethod] = useState<"GET" | "POST">("POST");
  const [apiHeaders, setApiHeaders] = useState("");
  const [apiBody, setApiBody] = useState("");

  useEffect(() => {
    if (rule) {
      setName(rule.name);
      setEnabled(rule.enabled);
      setAccountId(rule.accountId || "");
      setItemId(rule.itemId || "");
      setItemSpecification(rule.itemSpecification || "");
      setDeliveryType(rule.deliveryType);
      setDeliveryContent(rule.deliveryContent || "");
      setTriggerOn(rule.triggerOn);
      if (rule.apiConfig) {
        setApiUrl(rule.apiConfig.url);
        setApiMethod(rule.apiConfig.method);
        setApiHeaders(JSON.stringify(rule.apiConfig.headers || {}, null, 2));
        setApiBody(rule.apiConfig.body || "");
      }
    } else {
      setName("");
      setEnabled(true);
      setAccountId("");
      setItemId("");
      setItemSpecification("");
      setDeliveryType("fixed");
      setDeliveryContent("");
      setTriggerOn("paid");
      setApiUrl("");
      setApiMethod("POST");
      setApiHeaders("");
      setApiBody("");
    }
  }, [rule]);

  const handleSubmit = () => {
    const ruleData: Partial<AutoSellRule> = {
      name,
      enabled,
      accountId: accountId || null,
      itemId: itemId || null,
      itemSpecification: itemSpecification || null,
      deliveryType,
      deliveryContent: deliveryType === "fixed" ? deliveryContent : null,
      triggerOn,
      apiConfig:
        deliveryType === "api"
          ? {
              url: apiUrl,
              method: apiMethod,
              headers: apiHeaders ? JSON.parse(apiHeaders) : undefined,
              body: apiBody || undefined,
            }
          : null,
    };
    onSave(ruleData);
  };

  const isEditing = rule !== null;

  return (
    <div className="stat-card">
      <h3 className="font-semibold text-foreground mb-4">
        {isEditing ? "编辑规则" : "添加规则"}
      </h3>

      <div className="space-y-4">
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

        <div className="flex items-center justify-between">
          <Label htmlFor="enabled">启用规则</Label>
          <Switch id="enabled" checked={enabled} onCheckedChange={setEnabled} />
        </div>

        <div>
          <Label>适用账号</Label>
          <Select value={accountId} onValueChange={setAccountId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="选择账号" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acc_001">我的闲鱼小店</SelectItem>
              <SelectItem value="acc_002">数码优品店</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>适用商品</Label>
          <Select value={itemId} onValueChange={setItemId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="选择商品" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="item_001">iPhone 15 Pro Max</SelectItem>
              <SelectItem value="item_002">会员激活码</SelectItem>
              <SelectItem value="item_003">游戏点卡</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="spec">商品规格（可选）</Label>
          <Input
            id="spec"
            value={itemSpecification}
            onChange={(e) => setItemSpecification(e.target.value)}
            placeholder="如：月卡、季卡"
            className="mt-1"
          />
        </div>

        <div>
          <Label>发货方式</Label>
          <Select
            value={deliveryType}
            onValueChange={(v) => setDeliveryType(v as DeliveryType)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">固定内容</SelectItem>
              <SelectItem value="stock">库存发货</SelectItem>
              <SelectItem value="api">API 发货</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {deliveryType === "fixed" && (
          <div>
            <Label htmlFor="content">发货内容</Label>
            <Textarea
              id="content"
              value={deliveryContent}
              onChange={(e) => setDeliveryContent(e.target.value)}
              placeholder="输入发货内容"
              className="mt-1"
              rows={3}
            />
          </div>
        )}

        {deliveryType === "stock" && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground">
              库存发货需要在规则保存后，通过"管理库存"按钮添加库存内容。
            </p>
          </div>
        )}

        {deliveryType === "api" && (
          <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border/50">
            <div>
              <Label htmlFor="apiUrl">API URL</Label>
              <Input
                id="apiUrl"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.example.com/delivery"
                className="mt-1"
              />
            </div>
            <div>
              <Label>请求方法</Label>
              <Select
                value={apiMethod}
                onValueChange={(v) => setApiMethod(v as "GET" | "POST")}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="apiHeaders">请求头（JSON）</Label>
              <Textarea
                id="apiHeaders"
                value={apiHeaders}
                onChange={(e) => setApiHeaders(e.target.value)}
                placeholder='{"Content-Type": "application/json"}'
                className="mt-1 font-mono text-sm"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="apiBody">请求体</Label>
              <Textarea
                id="apiBody"
                value={apiBody}
                onChange={(e) => setApiBody(e.target.value)}
                placeholder='{"orderId": "{{orderId}}"}'
                className="mt-1 font-mono text-sm"
                rows={3}
              />
            </div>
          </div>
        )}

        <div>
          <Label>触发时机</Label>
          <Select
            value={triggerOn}
            onValueChange={(v) => setTriggerOn(v as TriggerOn)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">订单支付后</SelectItem>
              <SelectItem value="confirmed">订单确认后</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
