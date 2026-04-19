import React from 'react';
import type { NodeProps } from '@xyflow/react';
import { Play, CheckSquare, UserCheck, Zap, Square } from 'lucide-react';
import { NodeWrapper } from './NodeWrapper';
import type { StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData } from '../../types/workflow';

export const StartNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as StartNodeData;
  return (
    <NodeWrapper
      title={nodeData.title || 'Start'}
      icon={<Play size={16} />}
      selected={selected}
      hasTarget={false}
      className="border-green-500"
    >
      <div className="text-xs text-slate-500 text-center">Entry Point</div>
    </NodeWrapper>
  );
};

export const TaskNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as TaskNodeData;
  return (
    <NodeWrapper
      title={nodeData.title || 'Task'}
      icon={<CheckSquare size={16} />}
      selected={selected}
    >
      {nodeData.assignee && (
        <div className="text-xs mb-1"><span className="font-semibold">Assignee:</span> {nodeData.assignee}</div>
      )}
      {nodeData.dueDate && (
        <div className="text-xs"><span className="font-semibold">Due:</span> {nodeData.dueDate}</div>
      )}
      {!nodeData.assignee && !nodeData.dueDate && (
        <div className="text-xs text-slate-400 italic">Unassigned</div>
      )}
    </NodeWrapper>
  );
};

export const ApprovalNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as ApprovalNodeData;
  return (
    <NodeWrapper
      title={nodeData.title || 'Approval'}
      icon={<UserCheck size={16} />}
      selected={selected}
      className="border-amber-400"
    >
      <div className="text-xs">
        <span className="font-semibold">Role:</span> {nodeData.approverRole || 'Unassigned'}
      </div>
    </NodeWrapper>
  );
};

export const AutomatedNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as AutomatedNodeData;
  return (
    <NodeWrapper
      title={nodeData.title || 'Automated Step'}
      icon={<Zap size={16} />}
      selected={selected}
      className="border-purple-400"
    >
      <div className="text-xs truncate">
        {nodeData.actionId ? `Action: ${nodeData.actionId}` : <span className="italic text-slate-400">No action selected</span>}
      </div>
    </NodeWrapper>
  );
};

export const EndNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as EndNodeData;
  return (
    <NodeWrapper
      title={nodeData.title || 'End'}
      icon={<Square size={16} />}
      selected={selected}
      hasSource={false}
      className="border-red-400"
    >
      <div className="text-xs text-slate-500 text-center">Workflow End</div>
    </NodeWrapper>
  );
};
