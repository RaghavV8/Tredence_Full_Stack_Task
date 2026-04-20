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
    className="flex items-center gap-3 p-3 mb-2 bg-slate-900 border border-slate-700 rounded-md cursor-pointer hover:border-orange-500 hover:text-orange-500 hover:shadow-sm text-white transition-colors"
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
    <aside className="w-64 bg-gray-700 border-r border-slate-900 p-4 flex flex-col h-full shadow-sm z-10">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-orange-500">Nodes</h2>
        <p className="text-xs text-orange-500 mt-1">Drag and drop nodes to the canvas.</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <DraggableNode type="startNode" label="Start" icon={<Play size={18} style={{ color: 'green' }} />} />
        <DraggableNode type="taskNode" label="Task" icon={<CheckSquare size={18} style={{ color: 'blue' }} />} />
        <DraggableNode type="approvalNode" label="Approval" icon={<UserCheck size={18} color='#E5AE0B' />} />
        <DraggableNode type="automatedNode" label="Automated Step" icon={<Zap size={18} style={{ color: 'purple' }}/>} />
        <DraggableNode type="endNode" label="End" icon={<Square size={18} style={{ color: 'red' }}/>} />
      </div>
    </aside>
  );
};
