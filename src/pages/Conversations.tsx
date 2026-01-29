import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ConversationList } from "@/components/conversations/ConversationList";
import { MessageDetail } from "@/components/conversations/MessageDetail";
import { Conversation, Message } from "@/types/conversation.types";

// 模拟对话数据
const mockConversations: Conversation[] = [
  {
    accountId: "acc_001",
    chatId: "chat_001",
    userName: "张三",
    userAvatar: "",
    accountNickname: "我的闲鱼小店",
    lastMessage: "你好，这个商品还在吗？",
    lastTime: "2024-01-29T10:30:00Z",
    unread: 3,
    item: {
      id: "item_001",
      title: "iPhone 15 Pro Max 256GB 原封未激活",
      picUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop",
      price: "¥8,999",
    },
  },
  {
    accountId: "acc_001",
    chatId: "chat_002",
    userName: "李四",
    userAvatar: "",
    accountNickname: "我的闲鱼小店",
    lastMessage: "可以便宜一点吗？诚心想要",
    lastTime: "2024-01-29T09:15:00Z",
    unread: 1,
    item: {
      id: "item_002",
      title: "MacBook Pro 14寸 M3 Pro 512GB",
      picUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop",
      price: "¥15,888",
    },
  },
  {
    accountId: "acc_002",
    chatId: "chat_003",
    userName: "王五",
    userAvatar: "",
    accountNickname: "数码优品店",
    lastMessage: "好的，我现在下单",
    lastTime: "2024-01-29T08:45:00Z",
    unread: 0,
    item: {
      id: "item_003",
      title: "AirPods Pro 2代 全新未拆封",
      picUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=100&h=100&fit=crop",
      price: "¥1,599",
    },
  },
  {
    accountId: "acc_001",
    chatId: "chat_004",
    userName: "赵六",
    userAvatar: "",
    accountNickname: "我的闲鱼小店",
    lastMessage: "收到了，非常满意！给你五星好评",
    lastTime: "2024-01-28T16:20:00Z",
    unread: 0,
  },
  {
    accountId: "acc_002",
    chatId: "chat_005",
    userName: "孙七",
    userAvatar: "",
    accountNickname: "数码优品店",
    lastMessage: "请问支持验货吗？",
    lastTime: "2024-01-28T14:10:00Z",
    unread: 5,
    item: {
      id: "item_004",
      title: "索尼 WH-1000XM5 降噪耳机",
      picUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100&h=100&fit=crop",
      price: "¥2,299",
    },
  },
];

// 模拟消息数据
const mockMessages: Record<string, Message[]> = {
  "acc_001_chat_001": [
    {
      id: "msg_001",
      content: "你好，这个商品还在吗？",
      direction: "incoming",
      senderName: "张三",
      msgTime: "2024-01-29T10:25:00Z",
      msgId: "m1a2b3c4d5e6f7g8",
      itemId: "item_001",
    },
    {
      id: "msg_002",
      content: "在的，您看的是 iPhone 15 Pro Max 对吧？",
      direction: "outgoing",
      senderName: "我的闲鱼小店",
      msgTime: "2024-01-29T10:26:00Z",
      msgId: "m2b3c4d5e6f7g8h9",
    },
    {
      id: "msg_003",
      content: "对的，是全新未激活的吗？",
      direction: "incoming",
      senderName: "张三",
      msgTime: "2024-01-29T10:27:00Z",
      msgId: "m3c4d5e6f7g8h9i0",
    },
    {
      id: "msg_004",
      content: "是的，原封未激活，可以当面验货",
      direction: "outgoing",
      senderName: "我的闲鱼小店",
      msgTime: "2024-01-29T10:28:00Z",
      msgId: "m4d5e6f7g8h9i0j1",
    },
    {
      id: "msg_005",
      content: "价格还能优惠吗？",
      direction: "incoming",
      senderName: "张三",
      msgTime: "2024-01-29T10:30:00Z",
      msgId: "m5e6f7g8h9i0j1k2",
    },
  ],
};

const Conversations = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  const handleSelectConversation = (conversation: Conversation) => {
    // 标记为已读
    setConversations(prev =>
      prev.map(c =>
        c.chatId === conversation.chatId && c.accountId === conversation.accountId
          ? { ...c, unread: 0 }
          : c
      )
    );
    
    // 加载消息
    const key = `${conversation.accountId}_${conversation.chatId}`;
    setMessages(mockMessages[key] || []);
    setSelectedConversation(conversation);
  };

  const handleBack = () => {
    setSelectedConversation(null);
    setMessages([]);
  };

  const handleMarkAllRead = () => {
    setConversations(prev => prev.map(c => ({ ...c, unread: 0 })));
  };

  const handleDeleteConversation = (conversation: Conversation) => {
    setConversations(prev =>
      prev.filter(c => !(c.chatId === conversation.chatId && c.accountId === conversation.accountId))
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  return (
    <MainLayout>
      {selectedConversation ? (
        <MessageDetail
          conversation={selectedConversation}
          messages={messages}
          onBack={handleBack}
          onDeleteMessage={handleDeleteMessage}
        />
      ) : (
        <ConversationList
          conversations={conversations}
          totalUnread={totalUnread}
          onSelectConversation={handleSelectConversation}
          onMarkAllRead={handleMarkAllRead}
          onDeleteConversation={handleDeleteConversation}
        />
      )}
    </MainLayout>
  );
};

export default Conversations;
