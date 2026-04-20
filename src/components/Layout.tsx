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
    <div className="flex h-screen w-full bg-orange-200 overflow-hidden font-roboto">
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative">
        <header className="h-14 border-b border-slate-700 flex items-center justify-between px-4 bg-slate-900 z-10 shadow-sm">
          <h1 className="text-3xl text-orange-500 font-dancing ">Workflow Designer</h1>
          <button
            onClick={() => setIsSandboxOpen(true)}
            className="px-4 py-2 bg-orange-600 text-black hover:text-white rounded-md hover:bg-yellow-500 text-sm font-medium transition-colors shadow-sm font-ubuntu"
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
        <aside className="w-80 bg-black shadow-xl z-20 flex flex-col">
          <NodeConfigPanel />
        </aside>
      )}
    </div>
  );
};