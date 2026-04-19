import type { Node, Edge } from '@xyflow/react';

export interface ValidationError {
  nodeId?: string;
  message: string;
  severity: 'error' | 'warning';
}

export const validateWorkflow = (nodes: Node[], edges: Edge[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (nodes.length === 0) {
    errors.push({ message: 'Workflow is empty. Add at least a Start and End node.', severity: 'error' });
    return errors;
  }

  // Check for exactly one start node
  const startNodes = nodes.filter(n => n.type === 'startNode');
  if (startNodes.length === 0) {
    errors.push({ message: 'Workflow must have exactly one Start node.', severity: 'error' });
  } else if (startNodes.length > 1) {
    errors.push({ message: 'Workflow cannot have more than one Start node.', severity: 'error' });
  }

  // Check for at least one end node
  const endNodes = nodes.filter(n => n.type === 'endNode');
  if (endNodes.length === 0) {
    errors.push({ message: 'Workflow must have at least one End node.', severity: 'error' });
  }

  // Check for disconnected nodes
  const connectedNodeIds = new Set<string>();
  edges.forEach(e => {
    connectedNodeIds.add(e.source);
    connectedNodeIds.add(e.target);
  });

  // If more than 1 node, every node should appear in an edge
  if (nodes.length > 1) {
    nodes.forEach(node => {
      if (!connectedNodeIds.has(node.id)) {
        errors.push({
          nodeId: node.id,
          message: `Node "${(node.data as any).title || node.type}" is disconnected.`,
          severity: 'warning',
        });
      }
    });
  }

  // Check for cycles using DFS
  const hasCycle = detectCycle(nodes, edges);
  if (hasCycle) {
    errors.push({ message: 'Workflow contains a cycle (loop), which is not allowed.', severity: 'error' });
  }

  return errors;
};

const detectCycle = (nodes: Node[], edges: Edge[]): boolean => {
  const adj: Record<string, string[]> = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => { if (adj[e.source]) adj[e.source].push(e.target); });

  const visited = new Set<string>();
  const inStack = new Set<string>();

  const dfs = (id: string): boolean => {
    visited.add(id);
    inStack.add(id);
    for (const neighbor of (adj[id] || [])) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (inStack.has(neighbor)) {
        return true;
      }
    }
    inStack.delete(id);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }
  return false;
};
