import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  Panel,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflow } from '../../store/WorkflowContext';
import { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode } from '../Nodes/index';
import { v4 as uuidv4 } from 'uuid';

const nodeTypes: NodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  approvalNode: ApprovalNode,
  automatedNode: AutomatedNode,
  endNode: EndNode,
};

export const WorkflowCanvas: React.FC = () => {
  const { screenToFlowPosition } = useReactFlow();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
    setSelectedNodeId,
  } = useWorkflow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const label = type.replace('Node', ' Node');

      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: { title: label, type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        onPaneClick={() => setSelectedNodeId(null)}
        deleteKeyCode="Delete"
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-slate-50"
      >
        <Background gap={16} color="#black" />
        <Controls className="bg-white border border-slate-200 rounded shadow-sm" />
        <MiniMap zoomable pannable className="border border-black rounded shadow-sm "
        style={{ backgroundColor: '#334155' }} 
        nodeColor={(node)=>{
          switch(node.type){
            case 'startNode':
              return '#22c55e'; 
            case 'taskNode':
              return '#3b82f6'; 
            case 'approvalNode':
              return '#eab308'; 
            case 'automatedNode':
              return '#a855f7'; 
            case 'endNode':
              return '#ef4444';
            default:
              return '#94a3b8'; 
          }
        }} />
        <Panel
          position="top-center"
          className="bg-white px-3 py-1.5 shadow-sm border border-slate-200 rounded text-xs text-slate-500 pointer-events-none"
        >
          Drag nodes from the left sidebar · Click a node to configure · Press Delete to remove
        </Panel>
      </ReactFlow>
    </div>
  );
};
