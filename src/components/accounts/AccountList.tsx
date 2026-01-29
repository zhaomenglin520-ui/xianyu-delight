import { useState } from "react";
import {
  RefreshCw,
  Sparkles,
  Edit,
  Play,
  Square,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Account } from "@/types";

interface AccountListProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
  onToggleStatus: (accountId: string, connected: boolean) => void;
}

export function AccountList({ accounts, onEdit, onDelete, onToggleStatus }: AccountListProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, string>>({});

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAction = (accountId: string, action: string, callback: () => void) => {
    setLoadingStates(prev => ({ ...prev, [accountId]: action }));
    // Simulate API call
    setTimeout(() => {
      callback();
      setLoadingStates(prev => {
        const newState = { ...prev };
        delete newState[accountId];
        return newState;
      });
    }, 1000);
  };

  if (accounts.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">暂无账号，请在左侧添加</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">账号列表</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>账号</TableHead>
                <TableHead>备注</TableHead>
                <TableHead>连接状态</TableHead>
                <TableHead>账号状态</TableHead>
                <TableHead>更新时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => {
                const isConnected = account.status?.connected ?? false;
                const hasError = !!account.status?.errorMessage;
                const isLoading = !!loadingStates[account.id];

                return (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={account.avatar} />
                          <AvatarFallback>{account.nickname?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{account.nickname || "未知"}</p>
                          <p className="text-xs text-muted-foreground font-mono">{account.userId || account.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{account.remark || "-"}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={isConnected ? "default" : "secondary"}
                        className={cn(
                          "gap-1.5",
                          isConnected && "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30"
                        )}
                      >
                        {isConnected && (
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        )}
                        {isConnected ? "在线" : "离线"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {hasError ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="w-3 h-3" />
                              异常
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{account.status?.errorMessage}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-green-600 dark:text-green-400 border-green-500/30">
                          <CheckCircle className="w-3 h-3" />
                          正常
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(account.updatedAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={isLoading}
                              onClick={() => handleAction(account.id, "refresh", () => {})}
                            >
                              {loadingStates[account.id] === "refresh" ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <RefreshCw className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>刷新信息</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled={!isConnected || isLoading}
                              onClick={() => handleAction(account.id, "sparkle", () => {})}
                            >
                              {loadingStates[account.id] === "sparkle" ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Sparkles className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>一键擦亮</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onEdit(account)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>编辑</TooltipContent>
                        </Tooltip>

                        {isConnected ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-yellow-600 hover:text-yellow-700"
                                disabled={isLoading}
                                onClick={() => handleAction(account.id, "stop", () => onToggleStatus(account.id, false))}
                              >
                                {loadingStates[account.id] === "stop" ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>停止</TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-green-600 hover:text-green-700"
                                disabled={isLoading}
                                onClick={() => handleAction(account.id, "start", () => onToggleStatus(account.id, true))}
                              >
                                {loadingStates[account.id] === "start" ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>启动</TooltipContent>
                          </Tooltip>
                        )}

                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>删除</TooltipContent>
                          </Tooltip>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认删除</AlertDialogTitle>
                              <AlertDialogDescription>
                                确定要删除账号 "{account.nickname || account.id}" 吗？此操作无法撤销。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete(account.id)}>
                                删除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {accounts.map((account) => {
            const isConnected = account.status?.connected ?? false;
            const hasError = !!account.status?.errorMessage;
            const isLoading = !!loadingStates[account.id];

            return (
              <Card key={account.id} className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={account.avatar} />
                      <AvatarFallback>{account.nickname?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{account.nickname || "未知"}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {account.userId || account.id}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={isConnected ? "default" : "secondary"}
                          className={cn(
                            "gap-1 text-xs",
                            isConnected && "bg-green-500/20 text-green-600 dark:text-green-400"
                          )}
                        >
                          {isConnected && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                          {isConnected ? "在线" : "离线"}
                        </Badge>
                        {hasError ? (
                          <Badge variant="destructive" className="gap-1 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            异常
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 text-xs text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            正常
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {account.remark && (
                    <p className="text-sm text-muted-foreground mb-3">备注: {account.remark}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      更新: {formatDate(account.updatedAt)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(account)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {isConnected ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-yellow-600"
                          onClick={() => onToggleStatus(account.id, false)}
                        >
                          <Square className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600"
                          onClick={() => onToggleStatus(account.id, true)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>确认删除</AlertDialogTitle>
                            <AlertDialogDescription>
                              确定要删除账号 "{account.nickname || account.id}" 吗？
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(account.id)}>删除</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
