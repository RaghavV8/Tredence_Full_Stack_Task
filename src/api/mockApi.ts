import type { MockAction, SimulationStep } from '../types/workflow';
import type { Edge, Node } from '@xyflow/react';

// Mock data for GET /automations
const AUTOMATIONS: MockAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'slack_message', label: 'Send Slack Message', params: ['channel', 'message'] },
  { id: 'update_db', label: 'Update Database Record', params: ['table', 'recordId'] }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  /**
   * GET /automations
   * Returns a list of available automated actions.
   */
  getAutomations: async (): Promise<MockAction[]> => {
    await delay(500); // Simulate network latency
    return AUTOMATIONS;
  },

  /**
   * POST /simulate
   * Accepts workflow JSON (nodes and edges) and returns a mock step-by-step execution result.
   */
  simulate: async (payload: { nodes: Node[]; edges: Edge[] }): Promise<SimulationStep[]> => {
    await delay(1000); // Simulate processing time

    const { nodes, edges } = payload;
    const steps: SimulationStep[] = [];

    if (nodes.length === 0) {
      throw new Error('Workflow is empty.');
    }

    // Find the start node
    const startNodes = nodes.filter(n => n.type === 'startNode');
    if (startNodes.length === 0) {
      throw new Error('Workflow must have a Start Node.');
    }
    if (startNodes.length > 1) {
      throw new Error('Workflow cannot have multiple Start Nodes.');
    }

    let currentNode: Node | undefined = startNodes[0];
    const visited = new Set<string>();

    // Traverse the graph
    while (currentNode) {
      if (visited.has(currentNode.id)) {
        steps.push({
          nodeId: currentNode.id,
          nodeType: currentNode.type as any,
          title: currentNode.data.title as string || 'Unknown Node',
          status: 'error',
          message: 'Cycle detected. Simulation stopped.'
        });
        break;
      }

      visited.add(currentNode.id);

      // Simulate execution of current node
      let message = `Successfully executed ${currentNode.data.title || currentNode.type}`;
      if (currentNode.type === 'approvalNode' && !(currentNode.data as any).approverRole) {
         message = 'Warning: No approver role assigned.';
      }
      if (currentNode.type === 'automatedNode' && !(currentNode.data as any).actionId) {
         message = 'Warning: No action configured for automated step.';
      }

      steps.push({
        nodeId: currentNode.id,
        nodeType: currentNode.type as any,
        title: currentNode.data.title as string || currentNode.type || 'Node',
        status: 'success',
        message
      });

      // Find next node
      const outgoingEdges = edges.filter(e => e.source === currentNode?.id);
      
      if (outgoingEdges.length === 0) {
        if (currentNode.type !== 'endNode') {
           steps.push({
            nodeId: currentNode.id,
            nodeType: currentNode.type as any,
            title: currentNode.data.title as string || 'Unknown Node',
            status: 'error',
            message: 'Workflow ended abruptly without an End Node.'
          });
        }
        break;
      }
      
      // For simplicity in this demo, just follow the first outgoing edge
      // A more robust engine would handle branching
      const nextEdge = outgoingEdges[0];
      currentNode = nodes.find(n => n.id === nextEdge.target);
    }

    return steps;
  }
};
