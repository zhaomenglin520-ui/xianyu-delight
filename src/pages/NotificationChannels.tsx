import { useState } from "react";
import { Plus, Bell, MessageSquare, Phone, Mail, Link, MessageCircle, Send, Edit, Trash2, Zap, Loader2, Power } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { NotificationChannel, NotificationChannelType } from "@/types";

const channelTypes: { type: NotificationChannelType; name: string; icon: any; description: string }[] = [
  { type: "dingtalk", name: "钉钉通知", icon: Bell, description: "钉钉机器人消息" },
  { type: "wechat", name: "微信通知", icon: MessageCircle, description: "企业微信机器人" },
  { type: "telegram", name: "Telegram", icon: Send, description: "Telegram机器人" },
  { type: "email", name: "邮件通知", icon: Mail, description: "SMTP邮件发送" },
  { type: "webhook", name: "Webhook", icon: Link, description: "自定义HTTP请求" },
];

// Mock data
const mockChannels: NotificationChannel[] = [
  {
    id: 1,
    type: "dingtalk",
    name: "运营群通知",
    config: { webhookUrl: "https://oapi.dingtalk.com/robot/send?access_token=xxx" },
    enabled: true,
  },
  {
    id: 2,
    type: "email",
    name: "管理员邮箱",
    config: { smtpHost: "smtp.qq.com", smtpPort: 465, fromEmail: "admin@example.com" },
    enabled: true,
  },
  {
    id: 3,
    type: "telegram",
    name: "Telegram群组",
    config: { botToken: "xxx", chatId: "-123456789" },
    enabled: false,
  },
];

export default function NotificationChannels() {
  const [channels, setChannels] = useState<NotificationChannel[]>(mockChannels);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<NotificationChannel | null>(null);
  const [selectedType, setSelectedType] = useState<NotificationChannelType | null>(null);
  const [testingId, setTestingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    webhookUrl: "",
    botToken: "",
    chatId: "",
    smtpHost: "",
    smtpPort: "465",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "",
    url: "",
    method: "POST",
    headers: "{}",
    body: "{}",
  });

  const getChannelIcon = (type: NotificationChannelType) => {
    const found = channelTypes.find(c => c.type === type);
    return found?.icon || Bell;
  };

  const getChannelTypeName = (type: NotificationChannelType) => {
    const found = channelTypes.find(c => c.type === type);
    return found?.name || type;
  };

  const handleOpenDialog = (channel?: NotificationChannel) => {
    if (channel) {
      setEditingChannel(channel);
      setSelectedType(channel.type);
      setFormData({
        name: channel.name,
        webhookUrl: channel.config.webhookUrl || "",
        botToken: channel.config.botToken || "",
        chatId: channel.config.chatId || "",
        smtpHost: channel.config.smtpHost || "",
        smtpPort: channel.config.smtpPort?.toString() || "465",
        smtpUser: channel.config.smtpUser || "",
        smtpPassword: channel.config.smtpPassword || "",
        fromEmail: channel.config.fromEmail || "",
        fromName: channel.config.fromName || "",
        url: channel.config.url || "",
        method: channel.config.method || "POST",
        headers: JSON.stringify(channel.config.headers || {}, null, 2),
        body: channel.config.body || "{}",
      });
    } else {
      setEditingChannel(null);
      setSelectedType(null);
      setFormData({
        name: "",
        webhookUrl: "",
        botToken: "",
        chatId: "",
        smtpHost: "",
        smtpPort: "465",
        smtpUser: "",
        smtpPassword: "",
        fromEmail: "",
        fromName: "",
        url: "",
        method: "POST",
        headers: "{}",
        body: "{}",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!selectedType || !formData.name) return;

    const config: Record<string, any> = {};
    if (selectedType === "dingtalk" || selectedType === "wechat") {
      config.webhookUrl = formData.webhookUrl;
    } else if (selectedType === "telegram") {
      config.botToken = formData.botToken;
      config.chatId = formData.chatId;
    } else if (selectedType === "email") {
      config.smtpHost = formData.smtpHost;
      config.smtpPort = parseInt(formData.smtpPort);
      config.smtpUser = formData.smtpUser;
      config.smtpPassword = formData.smtpPassword;
      config.fromEmail = formData.fromEmail;
      config.fromName = formData.fromName;
    } else if (selectedType === "webhook") {
      config.url = formData.url;
      config.method = formData.method;
      try {
        config.headers = JSON.parse(formData.headers);
      } catch {
        config.headers = {};
      }
      config.body = formData.body;
    }

    if (editingChannel) {
      setChannels(channels.map(c => 
        c.id === editingChannel.id
          ? { ...c, name: formData.name, config }
          : c
      ));
    } else {
      setChannels([
        ...channels,
        {
          id: Date.now(),
          type: selectedType,
          name: formData.name,
          config,
          enabled: true,
        },
      ]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setChannels(channels.filter(c => c.id !== id));
  };

  const handleToggleEnabled = (id: number) => {
    setChannels(channels.map(c => 
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ));
  };

  const handleTest = (id: number) => {
    setTestingId(id);
    setTimeout(() => setTestingId(null), 2000);
  };

  const renderConfigFields = () => {
    if (!selectedType) return null;

    switch (selectedType) {
      case "dingtalk":
      case "wechat":
        return (
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input
              value={formData.webhookUrl}
              onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
              placeholder="https://oapi.dingtalk.com/robot/send?access_token=xxx"
            />
          </div>
        );
      case "telegram":
        return (
          <>
            <div className="space-y-2">
              <Label>Bot Token</Label>
              <Input
                value={formData.botToken}
                onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
              />
            </div>
            <div className="space-y-2">
              <Label>Chat ID</Label>
              <Input
                value={formData.chatId}
                onChange={(e) => setFormData({ ...formData, chatId: e.target.value })}
                placeholder="-123456789"
              />
            </div>
          </>
        );
      case "email":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SMTP服务器</Label>
                <Input
                  value={formData.smtpHost}
                  onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                  placeholder="smtp.qq.com"
                />
              </div>
              <div className="space-y-2">
                <Label>端口</Label>
                <Input
                  type="number"
                  value={formData.smtpPort}
                  onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
                  placeholder="465"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>用户名</Label>
                <Input
                  value={formData.smtpUser}
                  onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label>密码</Label>
                <Input
                  type="password"
                  value={formData.smtpPassword}
                  onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>发件人邮箱</Label>
                <Input
                  value={formData.fromEmail}
                  onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                  placeholder="noreply@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>发件人名称</Label>
                <Input
                  value={formData.fromName}
                  onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                  placeholder="系统通知"
                />
              </div>
            </div>
          </>
        );
      case "webhook":
        return (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>URL</Label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/webhook"
                />
              </div>
              <div className="space-y-2">
                <Label>方法</Label>
                <Select value={formData.method} onValueChange={(v) => setFormData({ ...formData, method: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>请求头 (JSON)</Label>
              <Textarea
                value={formData.headers}
                onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
                placeholder='{"Content-Type": "application/json"}'
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>请求体</Label>
              <Textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder='{"message": "{{content}}"}'
                className="font-mono text-sm"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">通知渠道</h1>
            <p className="text-muted-foreground">配置消息通知的发送渠道</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                添加渠道
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingChannel ? "编辑渠道" : "添加渠道"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Channel Type Selection */}
                {!editingChannel && (
                  <div className="space-y-2">
                    <Label>渠道类型</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {channelTypes.map((ct) => {
                        const Icon = ct.icon;
                        return (
                          <button
                            key={ct.type}
                            type="button"
                            onClick={() => setSelectedType(ct.type)}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                              selectedType === ct.type
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{ct.name}</p>
                              <p className="text-xs text-muted-foreground">{ct.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Channel Name */}
                {(selectedType || editingChannel) && (
                  <div className="space-y-2">
                    <Label>渠道名称</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="输入渠道名称"
                    />
                  </div>
                )}

                {/* Config Fields */}
                {renderConfigFields()}

                {/* Actions */}
                {(selectedType || editingChannel) && (
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={handleSave}>保存</Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Channel List */}
        {channels.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">暂无通知渠道，点击上方按钮添加</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel) => {
              const Icon = getChannelIcon(channel.type);
              return (
                <Card key={channel.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          channel.enabled ? "bg-primary/10" : "bg-muted"
                        )}>
                          <Icon className={cn("w-5 h-5", channel.enabled ? "text-primary" : "text-muted-foreground")} />
                        </div>
                        <div>
                          <p className="font-medium">{channel.name}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {getChannelTypeName(channel.type)}
                          </Badge>
                        </div>
                      </div>
                      <Switch
                        checked={channel.enabled}
                        onCheckedChange={() => handleToggleEnabled(channel.id)}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleTest(channel.id)}
                        disabled={testingId === channel.id}
                      >
                        {testingId === channel.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4 mr-2" />
                        )}
                        测试
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handleOpenDialog(channel)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>确认删除</AlertDialogTitle>
                            <AlertDialogDescription>
                              确定要删除渠道 "{channel.name}" 吗？
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(channel.id)}>删除</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
