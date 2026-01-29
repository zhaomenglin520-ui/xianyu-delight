import { useRef, useEffect } from "react";
import { ChevronLeft, Trash2, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Conversation, Message } from "@/types/conversation.types";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

interface MessageDetailProps {
  conversation: Conversation;
  messages: Message[];
  onBack: () => void;
  onDeleteMessage: (messageId: string) => void;
  isLoading?: boolean;
}

export function MessageDetail({
  conversation,
  messages,
  onBack,
  onDeleteMessage,
  isLoading = false,
}: MessageDetailProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (time: string) => {
    try {
      return format(new Date(time), "MM-dd HH:mm", { locale: zhCN });
    } catch {
      return time;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* 顶部栏 */}
      <div className="stat-card mb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={conversation.userAvatar} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary font-medium">
              {conversation.userName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground">
                {conversation.userName}
              </span>
              {conversation.accountNickname && (
                <Badge variant="secondary" className="text-xs font-normal">
                  {conversation.accountNickname}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span className="font-mono">ID: {conversation.chatId.slice(0, 8)}...</span>
              <span>{messages.length} 条消息</span>
            </div>
          </div>
        </div>
      </div>

      {/* 商品信息卡片 */}
      {conversation.item && (
        <div className="stat-card mb-4 cursor-pointer hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-4">
            {conversation.item.picUrl ? (
              <img
                src={conversation.item.picUrl}
                alt={conversation.item.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground line-clamp-2">
                {conversation.item.title}
              </p>
              <p className="text-lg font-semibold text-primary mt-1">
                {conversation.item.price}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 消息列表 */}
      <div className="flex-1 stat-card overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {/* 加载更早消息按钮 */}
          <div className="flex justify-center py-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              加载更早消息
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <p>暂无消息</p>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  userAvatar={conversation.userAvatar}
                  userName={conversation.userName}
                  onDelete={() => onDeleteMessage(message.id)}
                />
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  userAvatar?: string;
  userName: string;
  onDelete: () => void;
}

function MessageBubble({ message, userAvatar, userName, onDelete }: MessageBubbleProps) {
  const isOutgoing = message.direction === "outgoing";

  const formatTime = (time: string) => {
    try {
      return format(new Date(time), "HH:mm", { locale: zhCN });
    } catch {
      return time;
    }
  };

  return (
    <div
      className={cn(
        "group flex gap-3",
        isOutgoing ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* 头像 - 仅接收消息显示 */}
      {!isOutgoing && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={userAvatar} />
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary text-xs font-medium">
            {userName.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
      )}

      {/* 消息内容 */}
      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isOutgoing ? "items-end" : "items-start"
        )}
      >
        {/* 发送者信息 */}
        <div
          className={cn(
            "flex items-center gap-2 mb-1 text-xs text-muted-foreground",
            isOutgoing ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span className="font-medium">{message.senderName}</span>
          <span>{formatTime(message.msgTime)}</span>
          <span className="font-mono opacity-50">
            {message.msgId.slice(0, 8)}
          </span>
        </div>

        {/* 商品标签 */}
        {message.itemId && (
          <Badge
            variant="secondary"
            className={cn(
              "mb-1 text-xs",
              isOutgoing ? "mr-0" : "ml-0"
            )}
          >
            <Package className="w-3 h-3 mr-1" />
            关联商品
          </Badge>
        )}

        {/* 气泡 */}
        <div
          className={cn(
            "relative px-4 py-2.5 rounded-2xl max-w-full break-words",
            isOutgoing
              ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md"
          )}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>

        {/* 删除按钮 */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
            "text-destructive hover:text-destructive hover:bg-destructive/10"
          )}
          onClick={onDelete}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
