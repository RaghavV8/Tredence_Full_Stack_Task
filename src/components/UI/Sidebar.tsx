import React from 'react';
import { Play, CheckSquare, UserCheck, Zap, Square } from 'lucide-react';
import type { NodeType } from '../../types/workflow';

interface DraggableNodeProps {
  type: NodeType;
  label: string;
  icon: React.ReactNode;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({ type, label, icon }) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="flex items-center gap-3 p-3 mb-2 bg-white border border-slate-200 rounded-md cursor-grab hover:border-primary-500 hover:text-primary-600 hover:shadow-sm text-slate-600 transition-colors"
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      <div className="text-slate-400 group-hover:text-primary-500">{icon}</div>
      <span className="font-medium text-sm">{label}</span>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col h-full shadow-sm z-10">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Nodes</h2>
        <p className="text-xs text-slate-500 mt-1">Drag and drop nodes to the canvas.</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <DraggableNode type="startNode" label="Start" icon={<Play size={18} />} />
        <DraggableNode type="taskNode" label="Task" icon={<CheckSquare size={18} />} />
        <DraggableNode type="approvalNode" label="Approval" icon={<UserCheck size={18} />} />
        <DraggableNode type="automatedNode" label="Automated Step" icon={<Zap size={18} />} />
        <DraggableNode type="endNode" label="End" icon={<Square size={18} />} />
      </div>
    </aside>
  );
};
