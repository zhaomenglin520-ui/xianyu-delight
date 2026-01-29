/**
 * 账号相关类型定义
 */

export type ProxyType = 'http' | 'https' | null;

export interface Account {
    id: string;
    cookies: string;
    userId?: string;
    nickname?: string;
    avatar?: string;
    enabled: boolean;
    remark?: string;
    proxyType?: ProxyType;
    proxyHost?: string;
    proxyPort?: number;
    proxyUsername?: string;
    proxyPassword?: string;
    createdAt?: string;
    updatedAt?: string;
    status?: AccountStatus;
}

export interface ClientStatus {
    accountId: string;
    connected: boolean;
    userId: string;
}

export interface AccountStatus {
    accountId: string;
    connected: boolean;
    lastHeartbeat?: string;
    lastTokenRefresh?: string;
    errorMessage?: string;
}

export interface StatusResponse {
    clients: ClientStatus[];
    activeCount: number;
    messageCount: number;
    goodsCount?: number; // 商品总数
    pendingShipmentCount?: number; // 待发货订单总数
}
