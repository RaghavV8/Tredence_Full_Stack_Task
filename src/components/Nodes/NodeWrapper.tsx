import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface NodeWrapperProps {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  selected?: boolean;
  className?: string;
  hasTarget?: boolean;
  hasSource?: boolean;
}

export const NodeWrapper: React.FC<NodeWrapperProps> = ({
  title,
  icon,
  children,
  selected,
  className = '',
  hasTarget = true,
  hasSource = true,
}) => {
  return (
    <div
      className={`min-w-[200px] bg-white rounded-md shadow-md border-2 transition-all ${
        selected ? 'shadow-lg' : 'border-slate-200'
      } ${className}`}
    >
      {hasTarget && (
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400" />
      )}

      <div className="flex items-center gap-2 p-2 border-b border-slate-100 bg-slate-50 rounded-t-md">
        <div className="text-primary-500">{icon}</div>
        <div className="font-semibold text-sm text-slate-700">{title}</div>
      </div>

      {children && <div className="p-3 text-sm text-slate-600">{children}</div>}

      {hasSource && (
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-slate-400" />
      )}
    </div>
  );
};
