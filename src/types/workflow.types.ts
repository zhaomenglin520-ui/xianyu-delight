/**
 * 发货流程相关类型定义
 */

export type WorkflowNodeType =
    | 'trigger'
    | 'autoreply'
    | 'delivery'
    | 'ship'
    | 'delay'
    | 'condition';

export interface WorkflowNode {
    id: string;
    type: WorkflowNodeType;
    name: string;
    config: {
        autoReplyRuleId?: number;
        expectedKeywords?: string[];
        delaySeconds?: number;
        condition?: string;
        expression?: string;
    };
    posX: number;
    posY: number;
}

export interface WorkflowConnection {
    fromNode: string;
    fromOutput: string;
    toNode: string;
    toInput: string;
}

export interface WorkflowDefinition {
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
}

export interface Workflow {
    id: number;
    name: string;
    description: string | null;
    definition: WorkflowDefinition;
    isDefault: boolean;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
}
