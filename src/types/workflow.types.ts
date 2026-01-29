/**
 * 工作流相关类型定义
 */

export interface WorkflowStep {
  id: number;
  type: 'message' | 'delay' | 'condition';
  config: Record<string, any>;
  order: number;
}

export interface Workflow {
  id: number;
  name: string;
  description?: string;
  enabled: boolean;
  steps: WorkflowStep[];
  accountId?: string;
  createdAt?: string;
  updatedAt?: string;
}
