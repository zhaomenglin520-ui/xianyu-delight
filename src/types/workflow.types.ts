/**
 * 发货流程相关类型定义
 */

export type WorkflowNodeType =
    | 'trigger'
    | 'autoreply'
    | 'delivery'
    | 'ship'
    | 'delay'
    | 'condition'
    | 'notify';

// 编辑器使用的节点类型
export type NodeType = 'delivery' | 'delay' | 'condition' | 'autoreply' | 'notify';

// 编辑器使用的简化节点
export interface EditorNode {
    id: string;
    text: string;
    nodeType: NodeType;
    deliveryMode?: 'virtual' | 'real';
    deliveryContent?: string;
    delayMs?: number;
    delayMode?: 'fixed' | 'random' | 'smart';
    delayMinMs?: number;
    delayMaxMs?: number;
    expression?: string;
    keywords?: string;
    matchMode?: 'contains' | 'exact' | 'regex';
    promptMessage?: string;
    message?: string;
    children?: EditorNode[];
}

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
    description?: string | null;
    definition: WorkflowDefinition | string;
    isDefault: boolean;
    enabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
