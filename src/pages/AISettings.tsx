import { useState } from "react";
import { Sun, Moon, Monitor, Save, Zap, RefreshCw, Eye, EyeOff, Loader2, Check, X, Bot } from "lucide-react";
import { useTheme } from "next-themes";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const DEFAULT_PROMPT = `你是一个智能客服助手，专门帮助处理闲鱼平台的买家咨询。请遵循以下原则：

1. 友好专业：保持礼貌和专业的态度回复客户
2. 简洁明了：回复内容简洁，避免冗长
3. 解答疑问：针对商品、价格、发货等问题给出准确回答
4. 引导成交：适当引导买家下单，但不要过于激进
5. 安全合规：不要透露敏感信息，遵守平台规则`;

export default function AISettings() {
  const { theme, setTheme } = useTheme();
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    baseUrl: "https://api.openai.com/v1",
    apiKey: "",
    model: "gpt-3.5-turbo",
    systemPrompt: DEFAULT_PROMPT,
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleTest = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTestResult(Math.random() > 0.3 ? "success" : "error");
      setIsTesting(false);
    }, 2000);
  };

  const handleResetPrompt = () => {
    setFormData({ ...formData, systemPrompt: DEFAULT_PROMPT });
  };

  const themeOptions = [
    { value: "light", label: "浅色", icon: Sun },
    { value: "dark", label: "深色", icon: Moon },
    { value: "system", label: "跟随系统", icon: Monitor },
  ];

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">智能设置</h1>
          <p className="text-muted-foreground">配置主题和AI功能</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Theme Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-primary" />
                主题设置
              </CardTitle>
              <CardDescription>选择您喜欢的界面主题</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = theme === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                        isActive
                          ? "border-primary bg-primary/10"
                          : "border-transparent bg-muted/50 hover:bg-muted"
                      )}
                    >
                      <Icon className={cn("w-6 h-6", isActive ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-sm font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* AI Settings */}
          <Card className="glass-card md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                AI 配置
              </CardTitle>
              <CardDescription>配置AI自动回复功能的API连接</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="baseUrl">API 地址</Label>
                <Input
                  id="baseUrl"
                  value={formData.baseUrl}
                  onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                  placeholder="例如：https://api.openai.com/v1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API 密钥</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">API密钥将加密存储</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">模型名称</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="gpt-3.5-turbo"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleTest} variant="outline" disabled={isTesting || !formData.apiKey}>
                  {isTesting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  测试连接
                </Button>
                {testResult === "success" && (
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <Check className="w-4 h-4" />
                    连接成功
                  </span>
                )}
                {testResult === "error" && (
                  <span className="flex items-center gap-1 text-sm text-red-600">
                    <X className="w-4 h-4" />
                    连接失败
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Prompt */}
          <Card className="glass-card md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>系统提示词</CardTitle>
                  <CardDescription>配置AI的行为和回复风格</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetPrompt}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  重置提示词
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={formData.systemPrompt}
                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                placeholder="输入系统提示词..."
                className="min-h-[200px] font-mono text-sm"
              />

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  保存设置
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
