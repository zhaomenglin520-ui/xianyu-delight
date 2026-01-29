/**
 * 自动回复相关类型定义
 */

export interface AutoReplyRule {
    id: number;
    name: string;
    keywords: string[];
    replyText: string;
    enabled: boolean;
    accountId?: string;
    createdAt?: string;
    updatedAt?: string;
}
