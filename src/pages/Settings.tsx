import { useState } from "react";
import { Save, RefreshCw, Key, Eye, EyeOff, Loader2, Check, X, Settings2, Shield, Mail, Fingerprint } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SystemSettings {
  allowRegistration: boolean;
  showDefaultLoginInfo: boolean;
  loginSlideCaptcha: boolean;
  tokenCaptchaHeadless: boolean;
  heartbeatEnabled: boolean;
  captchaMode: "local" | "third_party" | "manual";
  captchaThirdPartyProvider: string;
  captchaThirdPartyApiKey: string;
  captchaManualVerifyBaseUrl: string;
  captchaLocalFailThreshold: number;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpFromEmail: string;
  smtpFromName: string;
}

export default function Settings() {
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState<"success" | "error" | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    smtp: false,
    captcha: false,
  });

  // System settings form
  const [settings, setSettings] = useState<SystemSettings>({
    allowRegistration: false,
    showDefaultLoginInfo: true,
    loginSlideCaptcha: true,
    tokenCaptchaHeadless: true,
    heartbeatEnabled: true,
    captchaMode: "local",
    captchaThirdPartyProvider: "yescaptcha",
    captchaThirdPartyApiKey: "",
    captchaManualVerifyBaseUrl: "",
    captchaLocalFailThreshold: 3,
    smtpHost: "",
    smtpPort: 465,
    smtpUser: "",
    smtpPassword: "",
    smtpFromEmail: "",
    smtpFromName: "",
  });

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleTestEmail = () => {
    setIsTestingEmail(true);
    setEmailTestResult(null);
    setTimeout(() => {
      setEmailTestResult(Math.random() > 0.3 ? "success" : "error");
      setIsTestingEmail(false);
    }, 2000);
  };

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) return;
    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordForm({ current: "", new: "", confirm: "" });
    }, 1000);
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">全局设置</h1>
          <p className="text-muted-foreground">配置系统参数和个人密码</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                基础设置
              </CardTitle>
              <CardDescription>配置系统的基本功能开关</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>允许注册</Label>
                  <p className="text-xs text-muted-foreground">允许新用户注册系统账号</p>
                </div>
                <Switch
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>显示默认登录信息</Label>
                  <p className="text-xs text-muted-foreground">在登录页显示默认账号密码</p>
                </div>
                <Switch
                  checked={settings.showDefaultLoginInfo}
                  onCheckedChange={(checked) => setSettings({ ...settings, showDefaultLoginInfo: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>登录滑块验证</Label>
                  <p className="text-xs text-muted-foreground">登录时需要完成滑块验证</p>
                </div>
                <Switch
                  checked={settings.loginSlideCaptcha}
                  onCheckedChange={(checked) => setSettings({ ...settings, loginSlideCaptcha: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Token验证无头模式</Label>
                  <p className="text-xs text-muted-foreground">验证时隐藏浏览器窗口</p>
                </div>
                <Switch
                  checked={settings.tokenCaptchaHeadless}
                  onCheckedChange={(checked) => setSettings({ ...settings, tokenCaptchaHeadless: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>心跳检测</Label>
                  <p className="text-xs text-muted-foreground">定期检测账号连接状态</p>
                </div>
                <Switch
                  checked={settings.heartbeatEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, heartbeatEnabled: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Captcha Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-primary" />
                验证码设置
              </CardTitle>
              <CardDescription>配置闲鱼验证码处理方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>验证码模式</Label>
                <Select
                  value={settings.captchaMode}
                  onValueChange={(v) => setSettings({ ...settings, captchaMode: v as typeof settings.captchaMode })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">本地处理</SelectItem>
                    <SelectItem value="third_party">第三方服务</SelectItem>
                    <SelectItem value="manual">手动验证</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {settings.captchaMode === "local" && (
                <div className="space-y-2">
                  <Label>本地失败阈值</Label>
                  <Input
                    type="number"
                    value={settings.captchaLocalFailThreshold}
                    onChange={(e) => setSettings({ ...settings, captchaLocalFailThreshold: parseInt(e.target.value) || 0 })}
                    placeholder="3"
                  />
                  <p className="text-xs text-muted-foreground">连续失败多少次后切换到手动验证</p>
                </div>
              )}

              {settings.captchaMode === "third_party" && (
                <>
                  <div className="space-y-2">
                    <Label>第三方提供商</Label>
                    <Select
                      value={settings.captchaThirdPartyProvider}
                      onValueChange={(v) => setSettings({ ...settings, captchaThirdPartyProvider: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yescaptcha">YesCaptcha</SelectItem>
                        <SelectItem value="2captcha">2Captcha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>API 密钥</Label>
                    <div className="relative">
                      <Input
                        type={showPasswords.captcha ? "text" : "password"}
                        value={settings.captchaThirdPartyApiKey}
                        onChange={(e) => setSettings({ ...settings, captchaThirdPartyApiKey: e.target.value })}
                        placeholder="请输入API密钥"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => togglePasswordVisibility("captcha")}
                      >
                        {showPasswords.captcha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {settings.captchaMode === "manual" && (
                <div className="space-y-2">
                  <Label>验证基础URL</Label>
                  <Input
                    value={settings.captchaManualVerifyBaseUrl}
                    onChange={(e) => setSettings({ ...settings, captchaManualVerifyBaseUrl: e.target.value })}
                    placeholder="https://your-verify-server.com"
                  />
                  <p className="text-xs text-muted-foreground">用于手动验证的外部服务地址</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                邮件设置
              </CardTitle>
              <CardDescription>配置SMTP邮件发送服务</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SMTP服务器</Label>
                  <Input
                    value={settings.smtpHost}
                    onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                    placeholder="smtp.qq.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>端口</Label>
                  <Input
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value) || 465 })}
                    placeholder="465"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>用户名</Label>
                  <Input
                    value={settings.smtpUser}
                    onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>密码</Label>
                  <div className="relative">
                    <Input
                      type={showPasswords.smtp ? "text" : "password"}
                      value={settings.smtpPassword}
                      onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => togglePasswordVisibility("smtp")}
                    >
                      {showPasswords.smtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>发件人邮箱</Label>
                  <Input
                    value={settings.smtpFromEmail}
                    onChange={(e) => setSettings({ ...settings, smtpFromEmail: e.target.value })}
                    placeholder="noreply@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>发件人名称</Label>
                  <Input
                    value={settings.smtpFromName}
                    onChange={(e) => setSettings({ ...settings, smtpFromName: e.target.value })}
                    placeholder="系统通知"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleTestEmail} disabled={isTestingEmail}>
                  {isTestingEmail ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                  测试邮件
                </Button>
                {emailTestResult === "success" && (
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <Check className="w-4 h-4" /> 发送成功
                  </span>
                )}
                {emailTestResult === "error" && (
                  <span className="flex items-center gap-1 text-sm text-red-600">
                    <X className="w-4 h-4" /> 发送失败
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                修改密码
              </CardTitle>
              <CardDescription>更改您的登录密码</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>当前密码</Label>
                <div className="relative">
                  <Input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    placeholder="请输入当前密码"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>新密码</Label>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    placeholder="请输入新密码"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>确认密码</Label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    placeholder="请再次输入新密码"
                    className={cn(
                      passwordForm.confirm && passwordForm.new !== passwordForm.confirm && "border-destructive"
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {passwordForm.confirm && passwordForm.new !== passwordForm.confirm && (
                  <p className="text-xs text-destructive">两次输入的密码不一致</p>
                )}
              </div>
              <Button
                onClick={handleChangePassword}
                disabled={isChangingPassword || !passwordForm.current || !passwordForm.new || passwordForm.new !== passwordForm.confirm}
              >
                {isChangingPassword ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
                修改密码
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            保存设置
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
