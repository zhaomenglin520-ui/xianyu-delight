/**
 * 自动回复相关类型定义
 */

export type MatchType = 'exact' | 'contains' | 'regex' | 'ai';
export type DelayMode = 'fixed' | 'random' | 'smart';
export type ItemMatchType = 'all' | 'onsale' | 'offsale';

export interface AutoReplyRule {
    id: number;
    name: string;
    enabled: boolean;
    priority: number;
    matchType: MatchType;
    matchPattern?: string;
    keywords?: string[];
    replyContent?: string;
    replyText?: string;
    accountId?: string;
    excludeMatch: boolean;
    itemMatchType: ItemMatchType;
    itemIds?: string[];
    delaySeconds: number;
    delayMode: DelayMode;
    smartDelaySecondsPerChar?: number;
    createdAt?: string;
    updatedAt?: string;
}
