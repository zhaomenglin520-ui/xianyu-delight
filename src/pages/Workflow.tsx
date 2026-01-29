import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { WorkflowList } from "@/components/workflow/WorkflowList";
import { WorkflowEditor } from "@/components/workflow/WorkflowEditor";
import type { Workflow as WorkflowType } from "@/types/workflow.types";

// 模拟工作流数据
const mockWorkflows: WorkflowType[] = [
  {
    id: 1,
    name: "默认发货流程",
    description: "适用于虚拟商品的自动发货流程",
    isDefault: true,
    definition: JSON.stringify({
      id: "root",
      text: "开始",
      nodeType: "delivery",
      deliveryMode: "virtual",
      children: [
        {
          id: "node_1",
          text: "发送商品卡密",
          nodeType: "delivery",
          deliveryMode: "virtual",
          deliveryContent: "您的卡密是：{{card_key}}",
        },
        {
          id: "node_2",
          text: "延迟30秒",
          nodeType: "delay",
          delayMode: "fixed",
          delayMs: 30000,
        },
        {
          id: "node_3",
          text: "发送确认消息",
          nodeType: "autoreply",
          message: "请查收，如有问题请联系客服",
        },
      ],
    }),
  },
  {
    id: 2,
    name: "实物发货流程",
    description: "适用于需要物流的实物商品",
    isDefault: false,
    definition: JSON.stringify({
      id: "root",
      text: "开始",
      nodeType: "delivery",
      deliveryMode: "real",
    }),
  },
  {
    id: 3,
    name: "智能回复流程",
    description: "基于关键词的智能客服回复流程",
    isDefault: false,
    definition: JSON.stringify({
      id: "root",
      text: "开始",
      nodeType: "condition",
      matchMode: "contains",
      keywords: "价格,多少钱",
    }),
  },
];

const WorkflowPage = () => {
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowType | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    setEditingWorkflow(null);
    setIsCreating(true);
  };

  const handleEdit = (workflow: WorkflowType) => {
    setEditingWorkflow(workflow);
    setIsCreating(false);
  };

  const handleDelete = (workflow: WorkflowType) => {
    setWorkflows(prev => prev.filter(w => w.id !== workflow.id));
  };

  const handleSetDefault = (workflow: WorkflowType) => {
    setWorkflows(prev =>
      prev.map(w => ({
        ...w,
        isDefault: w.id === workflow.id,
      }))
    );
  };

  const handleSave = (workflow: Partial<WorkflowType>) => {
    if (editingWorkflow) {
      // 更新
      setWorkflows(prev =>
        prev.map(w =>
          w.id === editingWorkflow.id ? { ...w, ...workflow } : w
        )
      );
    } else {
      // 创建
      const newWorkflow: WorkflowType = {
        id: Date.now(),
        name: workflow.name || "新流程",
        description: workflow.description,
        isDefault: workflow.isDefault || false,
        definition: workflow.definition || "{}",
      };
      setWorkflows(prev => [...prev, newWorkflow]);
    }
    setEditingWorkflow(null);
    setIsCreating(false);
  };

  const handleBack = () => {
    setEditingWorkflow(null);
    setIsCreating(false);
  };

  const showEditor = editingWorkflow !== null || isCreating;

  return (
    <MainLayout>
      {showEditor ? (
        <WorkflowEditor
          workflow={editingWorkflow}
          onSave={handleSave}
          onBack={handleBack}
        />
      ) : (
        <WorkflowList
          workflows={workflows}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSetDefault={handleSetDefault}
        />
      )}
    </MainLayout>
  );
};

export default WorkflowPage;
