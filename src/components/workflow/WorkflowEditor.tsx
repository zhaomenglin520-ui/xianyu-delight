import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Package,
  Clock,
  GitBranch,
  MessageSquare,
  Bell,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Workflow, NodeType, EditorNode } from "@/types/workflow.types";

interface WorkflowEditorProps {
  workflow: Workflow | null;
  onSave: (workflow: Partial<Workflow>) => void;
  onBack: () => void;
}

const nodeTypeConfig: Record<
  NodeType,
  { label: string; icon: typeof Package; color: string }
> = {
  delivery: { label: "发货节点", icon: Package, color: "text-green-500 bg-green-500/10" },
  delay: { label: "延迟节点", icon: Clock, color: "text-blue-500 bg-blue-500/10" },
  condition: { label: "条件节点", icon: GitBranch, color: "text-purple-500 bg-purple-500/10" },
  autoreply: { label: "自动回复", icon: MessageSquare, color: "text-orange-500 bg-orange-500/10" },
  notify: { label: "通知节点", icon: Bell, color: "text-pink-500 bg-pink-500/10" },
};

export function WorkflowEditor({ workflow, onSave, onBack }: WorkflowEditorProps) {
  const [name, setName] = useState(workflow?.name || "");
  const [description, setDescription] = useState(workflow?.description || "");
  const [isDefault, setIsDefault] = useState(workflow?.isDefault || false);
  const [nodes, setNodes] = useState<EditorNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<EditorNode | null>(null);

  useEffect(() => {
    if (workflow?.definition) {
      try {
        const defStr = typeof workflow.definition === 'string' 
          ? workflow.definition 
          : JSON.stringify(workflow.definition);
        const parsed = JSON.parse(defStr);
        // 将树形结构展平为数组
        const flatNodes: EditorNode[] = [];
        const flatten = (node: any, depth = 0) => {
          flatNodes.push({
            id: node.id,
            text: node.text,
            nodeType: node.nodeType,
            deliveryMode: node.deliveryMode,
            deliveryContent: node.deliveryContent,
            delayMs: node.delayMs,
            delayMode: node.delayMode,
            message: node.message,
            keywords: node.keywords,
            matchMode: node.matchMode,
          });
          if (node.children) {
            node.children.forEach((child: any) => flatten(child, depth + 1));
          }
        };
        flatten(parsed);
        setNodes(flatNodes);
      } catch {
        setNodes([]);
      }
    }
  }, [workflow]);

  const handleSave = () => {
    onSave({
      name,
      description,
      isDefault,
      definition: JSON.stringify(nodes),
    });
  };

  const handleAddNode = (type: NodeType) => {
    const newNode: EditorNode = {
      id: `node_${Date.now()}`,
      text: nodeTypeConfig[type].label,
      nodeType: type,
    };
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const handleUpdateNode = (nodeId: string, updates: Partial<EditorNode>) => {
    setNodes(nodes.map(n => (n.id === nodeId ? { ...n, ...updates } : n)));
    if (selectedNode?.id === nodeId) {
      setSelectedNode({ ...selectedNode, ...updates });
    }
  };

  return (
    <div className="space-y-4">
      {/* 顶部工具栏 */}
      <div className="stat-card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="name">流程名称</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入流程名称"
                className="mt-1"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="description">描述（可选）</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="输入流程描述"
                className="mt-1"
              />
            </div>
            <div className="flex items-end gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  checked={isDefault}
                  onCheckedChange={(checked) => setIsDefault(checked as boolean)}
                />
                <Label htmlFor="isDefault" className="text-sm">
                  设为默认流程
                </Label>
              </div>
              <Button onClick={handleSave} className="gap-2 ml-auto">
                <Save className="w-4 h-4" />
                保存
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 主编辑区 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* 节点类型选择 */}
        <div className="stat-card">
          <h3 className="font-semibold text-foreground mb-4">添加节点</h3>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(nodeTypeConfig) as NodeType[]).map((type) => {
              const config = nodeTypeConfig[type];
              const Icon = config.icon;
              return (
                <Button
                  key={type}
                  variant="outline"
                  className={cn(
                    "h-auto py-3 flex-col gap-2 hover:border-primary/50",
                    "transition-all duration-200"
                  )}
                  onClick={() => handleAddNode(type)}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs">{config.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* 流程预览 */}
        <div className="stat-card lg:col-span-2">
          <h3 className="font-semibold text-foreground mb-4">流程节点</h3>
          {nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <GitBranch className="w-12 h-12 mb-3 opacity-30" />
              <p>暂无节点</p>
              <p className="text-sm mt-1">从左侧选择节点类型添加</p>
            </div>
          ) : (
            <div className="space-y-2">
              {nodes.map((node, index) => {
                const config = nodeTypeConfig[node.nodeType];
                const Icon = config.icon;
                return (
                  <div key={node.id}>
                    {index > 0 && (
                      <div className="flex justify-center py-1">
                        <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer",
                        "transition-all duration-200 hover:border-primary/50",
                        selectedNode?.id === node.id && "border-primary ring-1 ring-primary/20"
                      )}
                      onClick={() => setSelectedNode(node)}
                    >
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", config.color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{node.text}</p>
                        <p className="text-xs text-muted-foreground">{config.label}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(node.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 节点配置面板 */}
      {selectedNode && (
        <div className="stat-card">
          <h3 className="font-semibold text-foreground mb-4">
            节点配置 - {nodeTypeConfig[selectedNode.nodeType].label}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>节点名称</Label>
              <Input
                value={selectedNode.text}
                onChange={(e) => handleUpdateNode(selectedNode.id, { text: e.target.value })}
                className="mt-1"
              />
            </div>

            {selectedNode.nodeType === "delivery" && (
              <>
                <div>
                  <Label>发货方式</Label>
                  <Select
                    value={selectedNode.deliveryMode || "virtual"}
                    onValueChange={(value) =>
                      handleUpdateNode(selectedNode.id, { deliveryMode: value as "virtual" | "real" })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">虚拟发货</SelectItem>
                      <SelectItem value="real">实物发货</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label>发货内容</Label>
                  <Textarea
                    value={selectedNode.deliveryContent || ""}
                    onChange={(e) => handleUpdateNode(selectedNode.id, { deliveryContent: e.target.value })}
                    placeholder="输入发货内容，支持变量如 {{card_key}}"
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {selectedNode.nodeType === "delay" && (
              <>
                <div>
                  <Label>延迟模式</Label>
                  <Select
                    value={selectedNode.delayMode || "fixed"}
                    onValueChange={(value) =>
                      handleUpdateNode(selectedNode.id, { delayMode: value as "fixed" | "random" | "smart" })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">固定延迟</SelectItem>
                      <SelectItem value="random">随机延迟</SelectItem>
                      <SelectItem value="smart">智能延迟</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>延迟时间（毫秒）</Label>
                  <Input
                    type="number"
                    value={selectedNode.delayMs || 0}
                    onChange={(e) => handleUpdateNode(selectedNode.id, { delayMs: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {selectedNode.nodeType === "condition" && (
              <>
                <div>
                  <Label>匹配模式</Label>
                  <Select
                    value={selectedNode.matchMode || "contains"}
                    onValueChange={(value) =>
                      handleUpdateNode(selectedNode.id, { matchMode: value as "contains" | "exact" | "regex" })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contains">包含关键词</SelectItem>
                      <SelectItem value="exact">精确匹配</SelectItem>
                      <SelectItem value="regex">正则表达式</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>关键词</Label>
                  <Input
                    value={selectedNode.keywords || ""}
                    onChange={(e) => handleUpdateNode(selectedNode.id, { keywords: e.target.value })}
                    placeholder="多个关键词用逗号分隔"
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {selectedNode.nodeType === "autoreply" && (
              <div className="sm:col-span-2">
                <Label>回复内容</Label>
                <Textarea
                  value={selectedNode.message || ""}
                  onChange={(e) => handleUpdateNode(selectedNode.id, { message: e.target.value })}
                  placeholder="输入自动回复内容"
                  className="mt-1"
                />
              </div>
            )}

            {selectedNode.nodeType === "notify" && (
              <div className="sm:col-span-2">
                <Label>通知内容</Label>
                <Textarea
                  value={selectedNode.message || ""}
                  onChange={(e) => handleUpdateNode(selectedNode.id, { message: e.target.value })}
                  placeholder="输入通知内容"
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
