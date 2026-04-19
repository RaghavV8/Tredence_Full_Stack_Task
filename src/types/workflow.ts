export type NodeType = 'startNode' | 'taskNode' | 'approvalNode' | 'automatedNode' | 'endNode';

export interface BaseNodeData {
  title: string;
  type: NodeType;
  [key: string]: any;
}

export interface StartNodeData extends BaseNodeData {
  type: 'startNode';
  metadata?: { key: string; value: string }[];
}

export interface TaskNodeData extends BaseNodeData {
  type: 'taskNode';
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields?: { key: string; value: string }[];
}

export interface ApprovalNodeData extends BaseNodeData {
  type: 'approvalNode';
  approverRole?: string;
  autoApproveThreshold?: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  type: 'automatedNode';
  actionId?: string;
  actionParams?: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  type: 'endNode';
  endMessage?: string;
  showSummary?: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export interface MockAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  nodeId: string;
  nodeType: NodeType;
  title: string;
  status: 'success' | 'error' | 'pending';
  message: string;
}
