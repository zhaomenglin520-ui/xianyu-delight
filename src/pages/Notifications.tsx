import { useState } from "react";
import { Plus, Bell, MessageSquare, Edit, Trash2, User, Tags } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MessageNotification, NotificationChannel, Account } from "@/types";

// Mock data
const mockAccounts: Account[] = [
  { id: "acc_001", nickname: "闲鱼小能手", userId: "12345678", cookies: "", enabled: true },
  { id: "acc_002", nickname: "二手交易达人", userId: "87654321", cookies: "", enabled: true },
];

const mockChannels: NotificationChannel[] = [
  { id: 1, type: "dingtalk", name: "运营群通知", config: {}, enabled: true },
  { id: 2, type: "email", name: "管理员邮箱", config: {}, enabled: true },
];

const mockNotifications: MessageNotification[] = [
  { id: 1, accountId: "acc_001", channelId: 1, keywords: "发货,售后", enabled: true },
  { id: 2, accountId: "acc_002", channelId: 2, keywords: "", enabled: true },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<MessageNotification[]>(mockNotifications);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<MessageNotification | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    accountId: "",
    channelId: "",
    keywords: "",
    enabled: true,
  });

  const getAccountName = (accountId: string) => {
    const account = mockAccounts.find(a => a.id === accountId);
    return account?.nickname || accountId;
  };

  const getChannelName = (channelId: number) => {
    const channel = mockChannels.find(c => c.id === channelId);
    return channel?.name || `渠道 #${channelId}`;
  };

  const getChannelType = (channelId: number) => {
    const channel = mockChannels.find(c => c.id === channelId);
    return channel?.type || "unknown";
  };

  const handleOpenDialog = (notification?: MessageNotification) => {
    if (notification) {
      setEditingNotification(notification);
      setFormData({
        accountId: notification.accountId,
        channelId: notification.channelId.toString(),
        keywords: notification.keywords || "",
        enabled: notification.enabled,
      });
    } else {
      setEditingNotification(null);
      setFormData({
        accountId: "",
        channelId: "",
        keywords: "",
        enabled: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.accountId || !formData.channelId) return;

    if (editingNotification) {
      setNotifications(notifications.map(n =>
        n.id === editingNotification.id
          ? {
              ...n,
              accountId: formData.accountId,
              channelId: parseInt(formData.channelId),
              keywords: formData.keywords,
              enabled: formData.enabled,
            }
          : n
      ));
    } else {
      setNotifications([
        ...notifications,
        {
          id: Date.now(),
          accountId: formData.accountId,
          channelId: parseInt(formData.channelId),
          keywords: formData.keywords,
          enabled: formData.enabled,
        },
      ]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleToggleEnabled = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ));
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">消息通知</h1>
            <p className="text-muted-foreground">配置消息触发通知规则</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                添加规则
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingNotification ? "编辑规则" : "添加规则"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>适用账号</Label>
                  <Select value={formData.accountId} onValueChange={(v) => setFormData({ ...formData, accountId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择账号" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.nickname || account.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>通知渠道</Label>
                  <Select value={formData.channelId} onValueChange={(v) => setFormData({ ...formData, channelId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择渠道" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockChannels.filter(c => c.enabled).map((channel) => (
                        <SelectItem key={channel.id} value={channel.id.toString()}>
                          {channel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>关键词（可选）</Label>
                  <Input
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="多个关键词用逗号分隔，留空则匹配所有消息"
                  />
                  <p className="text-xs text-muted-foreground">
                    只有消息中包含设定的关键词时才会触发通知
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <Label>启用规则</Label>
                  <Switch
                    checked={formData.enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleSave}>保存</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Notification Rules List */}
        {notifications.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">暂无通知规则，点击添加规则开始</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                添加规则
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notifications.map((notification) => (
              <Card key={notification.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{getAccountName(notification.accountId)}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{getChannelName(notification.channelId)}</span>
                        <Badge variant="outline" className="text-xs">
                          {getChannelType(notification.channelId)}
                        </Badge>
                      </div>
                      {notification.keywords ? (
                        <div className="flex items-center gap-2">
                          <Tags className="w-4 h-4 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {notification.keywords.split(",").map((keyword, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {keyword.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Tags className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">全部消息</span>
                        </div>
                      )}
                    </div>
                    <Switch
                      checked={notification.enabled}
                      onCheckedChange={() => handleToggleEnabled(notification.id)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(notification)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      编辑
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            确定要删除这条通知规则吗？
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(notification.id)}>删除</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
