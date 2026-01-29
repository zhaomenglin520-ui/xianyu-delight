/**
 * 定时任务相关类型定义
 */

export type TaskType = 'item_refresh';

export interface ScheduledTask {
    id: number;
    name: string;
    taskType: TaskType;
    accountId: string | null;
    enabled: boolean;
    intervalHours: number;
    delayMinutes: number;
    randomDelayMax: number;
    lastRunAt: string | null;
    nextRunAt: string | null;
    runCount: number;
    systemUserId: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateScheduledTaskParams {
    name: string;
    taskType: TaskType;
    accountId?: string | null;
    enabled?: boolean;
    intervalHours?: number;
    delayMinutes?: number;
    randomDelayMax?: number;
    nextRunAt?: string;
}

export interface UpdateScheduledTaskParams {
    name?: string;
    enabled?: boolean;
    intervalHours?: number;
    delayMinutes?: number;
    randomDelayMax?: number;
    accountId?: string | null;
    nextRunAt?: string;
}
