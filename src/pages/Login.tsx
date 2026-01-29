/**
 * 登录页面 - 玻璃拟态风格设计（支持深色模式）
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Fish, User, Mail, Lock, Eye, EyeOff, KeyRound, Loader2, ArrowRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

type LoginType = "account" | "email" | "code";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loginType, setLoginType] = useState<LoginType>("account");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    code: "",
    captcha: "",
  });

  const [registerFormData, setRegisterFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);
    try {
      // 模拟登录逻辑
      if (loginType === "code") {
        if (!formData.email || !formData.code) {
          toast({ title: "请输入邮箱和验证码", variant: "destructive" });
          setLoading(false);
          return;
        }
      } else {
        const loginValue = loginType === "account" ? formData.username : formData.email;
        if (!loginValue || !formData.password) {
          toast({ 
            title: loginType === "account" ? "请输入用户名和密码" : "请输入邮箱和密码", 
            variant: "destructive" 
          });
          setLoading(false);
          return;
        }
      }

      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({ title: "登录成功！" });
      navigate("/");
    } catch (error: any) {
      toast({ title: error?.message || "登录失败", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      toast({ title: "请先输入邮箱地址", variant: "destructive" });
      return;
    }

    setSendingCode(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(60);
      toast({ title: "验证码已发送，请查收邮箱" });
    } catch (error: any) {
      toast({ title: "发送验证码失败", variant: "destructive" });
    } finally {
      setSendingCode(false);
    }
  };

  const handleRegister = async () => {
    if (registering) return;

    if (!registerFormData.username || !registerFormData.password) {
      toast({ title: "用户名和密码不能为空", variant: "destructive" });
      return;
    }

    if (registerFormData.password !== registerFormData.confirmPassword) {
      toast({ title: "两次输入的密码不一致", variant: "destructive" });
      return;
    }

    setRegistering(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowRegisterModal(false);
      setRegisterFormData({ username: "", email: "", password: "", confirmPassword: "" });
      toast({ title: "注册成功，请登录" });
    } catch (error: any) {
      toast({ title: "注册失败", variant: "destructive" });
    } finally {
      setRegistering(false);
    }
  };

  const loginTypes = [
    { key: "account" as LoginType, label: "账号登录", icon: User },
    { key: "email" as LoginType, label: "邮箱登录", icon: Mail },
    { key: "code" as LoginType, label: "验证码", icon: KeyRound },
  ];

  return (
    <div className="login-page min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-background via-orange-50/30 to-amber-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* 主题切换按钮 */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 dark:bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-purple-500/10 to-cyan-500/10 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-teal-500/10 rounded-full blur-3xl" />
      </div>

      {/* 网格背景 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* 登录卡片 */}
      <div className="login-card relative z-10 w-full max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-3xl p-10 shadow-2xl dark:shadow-slate-900/50">
        {/* Logo 区域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-amber-400 dark:from-blue-500 dark:to-purple-500 shadow-lg shadow-primary/30 dark:shadow-blue-500/30 mb-4">
            <Fish className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">闲鱼智能管理系统</h1>
          <p className="text-muted-foreground mt-2 text-sm">欢迎回来，请登录您的账号</p>
        </div>

        {/* 登录类型切换 */}
        <div className="login-tabs flex rounded-xl p-1 mb-6 bg-muted/50 dark:bg-slate-800/50 border border-border/50 dark:border-slate-700/50">
          {loginTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => setLoginType(type.key)}
              className={cn(
                "login-tab flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200",
                loginType === type.key
                  ? "bg-gradient-to-r from-primary to-amber-400 dark:from-blue-500 dark:to-purple-500 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <type.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{type.label}</span>
            </button>
          ))}
        </div>

        {/* 登录表单 */}
        <div className="space-y-4">
          {loginType === "code" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/80">邮箱地址</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="请输入邮箱"
                    className="pl-10 bg-background/80 dark:bg-slate-800/60 border-border dark:border-slate-600/50 focus:border-primary dark:focus:border-blue-500"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground/80">发送验证码</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full dark:bg-slate-800/60 dark:border-slate-600/50 dark:hover:bg-slate-700/60"
                  onClick={handleSendCode}
                  disabled={sendingCode || countdown > 0}
                >
                  {sendingCode ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {countdown > 0 ? `${countdown}秒后重试` : "发送验证码"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className="text-foreground/80">验证码</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="code"
                    type="text"
                    placeholder="请输入验证码"
                    className="pl-10 bg-background/80 dark:bg-slate-800/60 border-border dark:border-slate-600/50 focus:border-primary dark:focus:border-blue-500"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground/80">
                  {loginType === "account" ? "用户名" : "邮箱地址"}
                </Label>
                <div className="relative">
                  {loginType === "account" ? (
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  )}
                  <Input
                    id="username"
                    type={loginType === "account" ? "text" : "email"}
                    placeholder={loginType === "account" ? "请输入用户名" : "请输入邮箱"}
                    className="pl-10 bg-background/80 dark:bg-slate-800/60 border-border dark:border-slate-600/50 focus:border-primary dark:focus:border-blue-500"
                    value={loginType === "account" ? formData.username : formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [loginType === "account" ? "username" : "email"]: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground/80">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入密码"
                    className="pl-10 pr-10 bg-background/80 dark:bg-slate-800/60 border-border dark:border-slate-600/50 focus:border-primary dark:focus:border-blue-500"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* 登录按钮 */}
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-11 text-base font-medium group bg-gradient-to-r from-primary to-amber-400 dark:from-blue-500 dark:to-purple-500 hover:opacity-90"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                登录
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>

          {/* 注册入口 */}
          <div className="text-center pt-2">
            <span className="text-muted-foreground text-sm">还没有账号？</span>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 text-sm font-medium ml-1 hover:underline transition-colors"
            >
              立即注册
            </button>
          </div>
        </div>
      </div>

      {/* 注册模态框 */}
      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent className="sm:max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-border dark:border-slate-700/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <UserPlus className="w-5 h-5 text-primary dark:text-blue-400" />
              注册账号
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reg-username">用户名</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-username"
                  placeholder="请输入用户名"
                  className="pl-10 dark:bg-slate-800/60 dark:border-slate-600/50"
                  value={registerFormData.username}
                  onChange={(e) =>
                    setRegisterFormData({ ...registerFormData, username: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email">邮箱（可选）</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="请输入邮箱"
                  className="pl-10 dark:bg-slate-800/60 dark:border-slate-600/50"
                  value={registerFormData.email}
                  onChange={(e) =>
                    setRegisterFormData({ ...registerFormData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="请输入密码"
                  className="pl-10 dark:bg-slate-800/60 dark:border-slate-600/50"
                  value={registerFormData.password}
                  onChange={(e) =>
                    setRegisterFormData({ ...registerFormData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-confirm">确认密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-confirm"
                  type="password"
                  placeholder="请再次输入密码"
                  className="pl-10 dark:bg-slate-800/60 dark:border-slate-600/50"
                  value={registerFormData.confirmPassword}
                  onChange={(e) =>
                    setRegisterFormData({ ...registerFormData, confirmPassword: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowRegisterModal(false)} className="dark:bg-slate-800/60 dark:border-slate-600/50 dark:hover:bg-slate-700/60">
              取消
            </Button>
            <Button onClick={handleRegister} disabled={registering} className="bg-gradient-to-r from-primary to-amber-400 dark:from-blue-500 dark:to-purple-500 hover:opacity-90">
              {registering ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              注册
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
