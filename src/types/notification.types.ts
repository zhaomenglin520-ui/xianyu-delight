/**
 * 通知相关类型定义
 */

export type NotificationChannelType = 'email' | 'webhook' | 'dingtalk' | 'wechat' | 'telegram';

export interface NotificationChannelConfig {
    [key: string]: any;
}

export interface NotificationChannel {
    id: number;
    type: NotificationChannelType;
    name: string;
    config: NotificationChannelConfig;
    enabled: boolean;
    accountId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface MessageNotification {
    id: number;
    accountId: string;
    channelId: number;
    keywords: string;
    enabled: boolean;
    createdAt?: string;
    updatedAt?: string;
}
