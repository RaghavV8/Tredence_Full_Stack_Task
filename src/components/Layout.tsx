import React, { useState } from 'react';
import { Sidebar } from './UI/Sidebar';
import { WorkflowCanvas } from './Canvas/WorkflowCanvas';
import { NodeConfigPanel } from './Forms/NodeConfigPanel';
import { SimulationPanel } from './Sandbox/SimulationPanel';
import { useWorkflow } from '../store/WorkflowContext';

export const Layout: React.FC = () => {
  const { selectedNodeId } = useWorkflow();
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative">
        <header className="h-14 border-b border-slate-200 flex items-center justify-between px-4 bg-white z-10 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">HR Workflow Designer</h1>
          <button
            onClick={() => setIsSandboxOpen(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium transition-colors shadow-sm"
          >
            Test Workflow
          </button>
        </header>
        
        <div className="flex-1 relative">
          <WorkflowCanvas />
        </div>

        {isSandboxOpen && (
          <SimulationPanel onClose={() => setIsSandboxOpen(false)} />
        )}
      </main>

      {selectedNodeId && (
        <aside className="w-80 bg-white border-l border-slate-200 shadow-xl z-20 flex flex-col">
          <NodeConfigPanel />
        </aside>
      )}
    </div>
  );
};
