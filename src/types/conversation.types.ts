/**
 * 对话相关类型定义
 */

export interface ConversationMessage {
    id: number;
    senderId: string;
    senderName: string;
    content: string;
    msgTime: string;
    msgId?: string;
    timestamp: number;
    direction: 'in' | 'out';
    itemId?: string;
}

// 用于组件的 Message 类型（简化版）
export interface Message {
    id: string;
    content: string;
    direction: 'incoming' | 'outgoing';
    senderName: string;
    msgTime: string;
    msgId: string;
    itemId?: string;
}

export interface Conversation {
    accountId: string;
    accountNickname?: string;
    chatId: string;
    userId?: string;
    userName: string;
    userAvatar?: string;
    lastMessage?: string;
    lastTime?: string | number;
    unread: number;
    messageCount?: number;
    messages?: ConversationMessage[];
    item?: {
        id: string;
        title: string | null;
        picUrl: string | null;
        price: string | null;
    } | null;
}

export interface ConversationListResponse {
    conversations: Conversation[];
    total: number;
    limit: number;
    offset: number;
}
