import { useState, useEffect } from "react";
import { Cookie, QrCode, Lock, Plus, Save, X, HelpCircle, Zap, Loader2, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Account, ProxyType } from "@/types";

interface AccountFormProps {
  account: Account | null;
  onSave: (account: Partial<Account>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

type LoginMethod = "cookie" | "qrcode" | "password";
type QRStatus = "idle" | "waiting" | "scanning" | "success" | "expired" | "error";

export function AccountForm({ account, onSave, onCancel, isLoading }: AccountFormProps) {
  const isEditMode = !!account;
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("cookie");
  const [qrStatus, setQrStatus] = useState<QRStatus>("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [showProxyPassword, setShowProxyPassword] = useState(false);

  // Form state
  const [cookies, setCookies] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remark, setRemark] = useState(account?.remark || "");
  const [proxyType, setProxyType] = useState<ProxyType>(account?.proxyType || null);
  const [proxyHost, setProxyHost] = useState(account?.proxyHost || "");
  const [proxyPort, setProxyPort] = useState(account?.proxyPort?.toString() || "");
  const [proxyUsername, setProxyUsername] = useState(account?.proxyUsername || "");
  const [proxyPassword, setProxyPassword] = useState(account?.proxyPassword || "");
  const [showBrowser, setShowBrowser] = useState(false);

  useEffect(() => {
    if (account) {
      setRemark(account.remark || "");
      setProxyType(account.proxyType || null);
      setProxyHost(account.proxyHost || "");
      setProxyPort(account.proxyPort?.toString() || "");
      setProxyUsername(account.proxyUsername || "");
      setProxyPassword(account.proxyPassword || "");
    } else {
      resetForm();
    }
  }, [account]);

  const resetForm = () => {
    setCookies("");
    setUsername("");
    setPassword("");
    setRemark("");
    setProxyType(null);
    setProxyHost("");
    setProxyPort("");
    setProxyUsername("");
    setProxyPassword("");
    setQrStatus("idle");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      cookies: cookies || undefined,
      remark,
      proxyType,
      proxyHost: proxyHost || undefined,
      proxyPort: proxyPort ? parseInt(proxyPort) : undefined,
      proxyUsername: proxyUsername || undefined,
      proxyPassword: proxyPassword || undefined,
    });
  };

  const handleGetQRCode = () => {
    setQrStatus("waiting");
    // Simulate QR code fetching
    setTimeout(() => setQrStatus("scanning"), 1500);
  };

  const handleTestProxy = () => {
    // Simulate proxy test
    console.log("Testing proxy...");
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {isEditMode ? (
            <>
              <Save className="w-5 h-5 text-primary" />
              编辑账号
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 text-primary" />
              添加账号
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Login Method Tabs - Only show in add mode */}
          {!isEditMode && (
            <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as LoginMethod)}>
              <TabsList className="w-full grid grid-cols-3 bg-muted/50">
                <TabsTrigger value="cookie" className="flex items-center gap-2">
                  <Cookie className="w-4 h-4" />
                  <span className="hidden sm:inline">Cookie</span>
                </TabsTrigger>
                <TabsTrigger value="qrcode" className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  <span className="hidden sm:inline">扫码登录</span>
                </TabsTrigger>
                <TabsTrigger value="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">账号密码</span>
                </TabsTrigger>
              </TabsList>

              {/* Cookie Login */}
              <TabsContent value="cookie" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cookies">Cookie</Label>
                  <Textarea
                    id="cookies"
                    value={cookies}
                    onChange={(e) => setCookies(e.target.value)}
                    placeholder="粘贴Cookie字符串，系统将自动获取用户信息"
                    className="font-mono text-sm min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    账号ID将从Cookie中自动获取
                  </p>
                </div>
              </TabsContent>

              {/* QR Code Login */}
              <TabsContent value="qrcode" className="mt-4">
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  {qrStatus === "idle" && (
                    <Button type="button" onClick={handleGetQRCode}>
                      <QrCode className="w-4 h-4 mr-2" />
                      获取二维码
                    </Button>
                  )}
                  {qrStatus === "waiting" && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      正在获取二维码...
                    </div>
                  )}
                  {qrStatus === "scanning" && (
                    <>
                      <div className="w-48 h-48 bg-muted rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                        <QrCode className="w-24 h-24 text-muted-foreground/50" />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        请使用闲鱼APP扫描二维码登录
                      </p>
                      <Button type="button" variant="outline" onClick={() => setQrStatus("idle")}>
                        取消
                      </Button>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Password Login */}
              <TabsContent value="password" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">账号/手机号</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入账号或手机号"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="请输入密码"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showBrowser"
                    checked={showBrowser}
                    onCheckedChange={(checked) => setShowBrowser(checked as boolean)}
                  />
                  <Label htmlFor="showBrowser" className="text-sm text-muted-foreground cursor-pointer">
                    显示浏览器窗口（调试用）
                  </Label>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Edit mode - Cookie input */}
          {isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="edit-cookies">Cookie（可选）</Label>
              <Textarea
                id="edit-cookies"
                value={cookies}
                onChange={(e) => setCookies(e.target.value)}
                placeholder="留空保持原有Cookies，填写则更新"
                className="font-mono text-sm min-h-[80px]"
              />
            </div>
          )}

          {/* Account ID - Only in edit mode */}
          {isEditMode && account && (
            <div className="space-y-2">
              <Label>账号ID</Label>
              <Input
                value={account.id}
                disabled
                className="font-mono text-sm bg-muted/50"
              />
            </div>
          )}

          {/* Remark */}
          <div className="space-y-2">
            <Label htmlFor="remark">备注</Label>
            <Input
              id="remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="可选，用于区分多个账号"
            />
          </div>

          {/* Proxy Settings */}
          <div className="space-y-4">
            <Label className="text-base font-medium">代理设置（可选）</Label>
            <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="space-y-2">
                <Label htmlFor="proxyType">代理类型</Label>
                <Select value={proxyType || "none"} onValueChange={(v) => setProxyType(v === "none" ? null : v as ProxyType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择代理类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">不使用代理</SelectItem>
                    <SelectItem value="http">HTTP</SelectItem>
                    <SelectItem value="https">HTTPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {proxyType && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="proxyHost">代理地址</Label>
                      <Input
                        id="proxyHost"
                        value={proxyHost}
                        onChange={(e) => setProxyHost(e.target.value)}
                        placeholder="127.0.0.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proxyPort">端口</Label>
                      <Input
                        id="proxyPort"
                        type="number"
                        value={proxyPort}
                        onChange={(e) => setProxyPort(e.target.value)}
                        placeholder="7890"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="proxyUser">用户名</Label>
                      <Input
                        id="proxyUser"
                        value={proxyUsername}
                        onChange={(e) => setProxyUsername(e.target.value)}
                        placeholder="可选"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proxyPass">密码</Label>
                      <div className="relative">
                        <Input
                          id="proxyPass"
                          type={showProxyPassword ? "text" : "password"}
                          value={proxyPassword}
                          onChange={(e) => setProxyPassword(e.target.value)}
                          placeholder="可选"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowProxyPassword(!showProxyPassword)}
                        >
                          {showProxyPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={handleTestProxy}>
                    <Zap className="w-4 h-4 mr-2" />
                    测试代理连接
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={cn("flex gap-2", isEditMode ? "flex-row" : "flex-col")}>
            {isEditMode ? (
              <>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  保存
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  <X className="w-4 h-4 mr-2" />
                  取消
                </Button>
              </>
            ) : (
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                添加账号
              </Button>
            )}
          </div>

          {/* Help Card */}
          {!isEditMode && loginMethod === "cookie" && (
            <Card className="bg-muted/30 border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  如何获取 Cookies？
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>登录闲鱼网页版 (goofish.com)</li>
                  <li>按 F12 打开开发者工具</li>
                  <li>切换到 Network 标签</li>
                  <li>刷新页面，点击任意请求</li>
                  <li>在 Headers 中找到 Cookie</li>
                </ol>
              </CardContent>
            </Card>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
