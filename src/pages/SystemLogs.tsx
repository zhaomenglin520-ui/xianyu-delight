import { useState, useEffect, useRef } from "react";
import { Radio, History, FileText, RefreshCw, Loader2 } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { LogLevel, ParsedLog, LogFile } from "@/types";

// Mock data generator
const generateMockLogs = (count: number): ParsedLog[] => {
  const levels: LogLevel[] = ["DEBUG", "INFO", "WARN", "ERROR"];
  const modules = ["Server", "WebSocket", "Account", "Message", "Order", "Database"];
  const messages = [
    "Connection established successfully",
    "Processing incoming message",
    "Order received: #12345",
    "Account heartbeat received",
    "Database query executed in 15ms",
    "WebSocket connection timeout",
    "Failed to refresh token",
    "Invalid cookie format detected",
    "Message queue processed",
    "Cache cleared successfully",
  ];

  return Array.from({ length: count }, (_, i) => {
    const level = levels[Math.floor(Math.random() * levels.length)];
    const module = modules[Math.floor(Math.random() * modules.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    const time = new Date(Date.now() - (count - i) * 1000).toISOString();

    return {
      time,
      level,
      module,
      message,
      raw: `[${time}] [${level}] [${module}] ${message}`,
    };
  });
};

const mockLogFiles: LogFile[] = [
  { name: "app-2024-01-20.log", size: 1024 * 512, mtime: Date.now() - 86400000 },
  { name: "app-2024-01-19.log", size: 1024 * 768, mtime: Date.now() - 86400000 * 2 },
  { name: "app-2024-01-18.log", size: 1024 * 1024, mtime: Date.now() - 86400000 * 3 },
];

const availableDates = ["2024-01-20", "2024-01-19", "2024-01-18"];

const levelColors: Record<LogLevel, string> = {
  ALL: "bg-gray-500/20 text-gray-600 dark:text-gray-400",
  DEBUG: "bg-gray-500/20 text-gray-600 dark:text-gray-400",
  INFO: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  WARN: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
  ERROR: "bg-red-500/20 text-red-600 dark:text-red-400",
};

export default function SystemLogs() {
  const [mode, setMode] = useState<"realtime" | "history">("realtime");
  const [level, setLevel] = useState<LogLevel>("ALL");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [logs, setLogs] = useState<ParsedLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial load and auto-refresh
  useEffect(() => {
    if (mode === "realtime") {
      setLogs(generateMockLogs(50));
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "realtime" && autoRefresh) {
      const interval = setInterval(() => {
        setLogs(prev => {
          const newLog = generateMockLogs(1)[0];
          return [...prev.slice(-99), newLog];
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [mode, autoRefresh]);

  // Auto-scroll to bottom for realtime
  useEffect(() => {
    if (mode === "realtime" && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, mode]);

  const handleLoadHistoryFile = () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setTimeout(() => {
      setLogs(generateMockLogs(100));
      setIsLoading(false);
    }, 500);
  };

  const filteredLogs = level === "ALL" 
    ? logs 
    : logs.filter(log => log.level === level);

  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">系统日志</h1>
            <p className="text-muted-foreground">查看系统运行日志和错误信息</p>
          </div>

          {/* Mode Toggle */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as "realtime" | "history")}>
            <TabsList>
              <TabsTrigger value="realtime" className="gap-2">
                <Radio className="w-4 h-4" />
                实时日志
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="w-4 h-4" />
                历史日志
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Toolbar */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Level Filter */}
              <div className="flex items-center gap-2">
                <Label>等级筛选:</Label>
                <Select value={level} onValueChange={(v) => setLevel(v as LogLevel)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">全部等级</SelectItem>
                    <SelectItem value="DEBUG">DEBUG</SelectItem>
                    <SelectItem value="INFO">INFO</SelectItem>
                    <SelectItem value="WARN">WARN</SelectItem>
                    <SelectItem value="ERROR">ERROR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Realtime Controls */}
              {mode === "realtime" && (
                <div className="flex items-center gap-2 ml-auto">
                  <Label htmlFor="autoRefresh">自动刷新:</Label>
                  <Switch
                    id="autoRefresh"
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                  />
                  {autoRefresh && (
                    <span className="text-xs text-muted-foreground animate-pulse">
                      每3秒刷新
                    </span>
                  )}
                </div>
              )}

              {/* History Controls */}
              {mode === "history" && (
                <>
                  <div className="flex items-center gap-2">
                    <Label>日期:</Label>
                    <Select value={selectedDate} onValueChange={setSelectedDate}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDates.map((date) => (
                          <SelectItem key={date} value={date}>{date}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label>文件:</Label>
                    <Select value={selectedFile} onValueChange={setSelectedFile}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="选择日志文件" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockLogFiles.map((file) => (
                          <SelectItem key={file.name} value={file.name}>
                            {file.name} ({formatFileSize(file.size)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoadHistoryFile}
                    disabled={!selectedFile || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    加载
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Log Display */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {mode === "realtime" ? "实时日志" : "历史日志"}
              <Badge variant="outline" className="text-xs">
                {filteredLogs.length} 条记录
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">暂无日志</p>
              </div>
            ) : (
              <ScrollArea
                ref={scrollRef}
                className="h-[500px] rounded-lg bg-muted/30 p-4"
              >
                <div className="space-y-1 font-mono text-sm">
                  {filteredLogs.map((log, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start gap-2 py-1 px-2 rounded hover:bg-muted/50",
                        log.level === "ERROR" && "bg-red-500/5"
                      )}
                    >
                      <span className="text-muted-foreground shrink-0 w-20">
                        {formatTime(log.time)}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("shrink-0 w-16 justify-center text-xs", levelColors[log.level])}
                      >
                        {log.level}
                      </Badge>
                      {log.module && (
                        <span className="text-muted-foreground shrink-0 w-24 truncate">
                          [{log.module}]
                        </span>
                      )}
                      <span className="flex-1 break-all">{log.message}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
