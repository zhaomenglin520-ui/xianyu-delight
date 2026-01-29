import { CheckCircle, RefreshCw, Trash2, MessageCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Conversation } from "@/types/conversation.types";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface ConversationListProps {
  conversations: Conversation[];
  totalUnread: number;
  onSelectConversation: (conversation: Conversation) => void;
  onMarkAllRead: () => void;
  onDeleteConversation: (conversation: Conversation) => void;
}

export function ConversationList({
  conversations,
  totalUnread,
  onSelectConversation,
  onMarkAllRead,
  onDeleteConversation,
}: ConversationListProps) {
  const formatTime = (time?: string) => {
    if (!time) return "";
    try {
      return formatDistanceToNow(new Date(time), { addSuffix: true, locale: zhCN });
    } catch {
      return time;
    }
  };

  return (
    <div className="space-y-4">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-foreground">对话消息</h1>
          <Badge variant="secondary" className="rounded-full">
            {conversations.length} 个对话
          </Badge>
          {totalUnread > 0 && (
            <Badge className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
              {totalUnread} 条未读
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {totalUnread > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllRead}
              className="gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">全部已读</span>
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">刷新</span>
          </Button>
        </div>
      </div>

      {/* 对话列表 */}
      {conversations.length === 0 ? (
        <div className="stat-card flex flex-col items-center justify-center py-16 text-muted-foreground">
          <MessageCircle className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg">暂无对话消息</p>
          <p className="text-sm mt-1">当有新消息时会显示在这里</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation) => (
            <div
              key={`${conversation.accountId}_${conversation.chatId}`}
              className={cn(
                "stat-card group cursor-pointer",
                "hover:border-primary/30 hover:shadow-md",
                "transition-all duration-200",
                conversation.unread > 0 && "border-l-4 border-l-primary"
              )}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex items-start gap-4">
                {/* 头像 */}
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage src={conversation.userAvatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary font-medium">
                    {conversation.userName.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>

                {/* 主内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground truncate">
                      {conversation.userName}
                    </span>
                    {conversation.accountNickname && (
                      <Badge variant="secondary" className="text-xs font-normal">
                        {conversation.accountNickname}
                      </Badge>
                    )}
                  </div>

                  {/* 商品信息 */}
                  {conversation.item && (
                    <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-muted/50">
                      {conversation.item.picUrl ? (
                        <img
                          src={conversation.item.picUrl}
                          alt={conversation.item.title}
                          className="w-8 h-8 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-sm text-muted-foreground truncate flex-1">
                        {conversation.item.title}
                      </span>
                      <span className="text-sm font-medium text-primary flex-shrink-0">
                        {conversation.item.price}
                      </span>
                    </div>
                  )}

                  {/* 最后消息 */}
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage || "暂无消息"}
                  </p>
                </div>

                {/* 右侧信息 */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {formatTime(typeof conversation.lastTime === 'number' ? new Date(conversation.lastTime).toISOString() : conversation.lastTime)}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {/* 未读徽章 */}
                    {conversation.unread > 0 && (
                      <Badge className="h-5 min-w-[20px] px-1.5 text-[10px] font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                        {conversation.unread > 99 ? "99+" : conversation.unread}
                      </Badge>
                    )}
                    
                    {/* 删除按钮 */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 加载更多 */}
          <div className="flex justify-center pt-4">
            <Button variant="outline" className="w-full max-w-xs">
              加载更多
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
