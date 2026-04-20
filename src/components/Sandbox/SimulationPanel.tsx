import React, { useState, useCallback } from 'react';
import { X, Play, CheckCircle, XCircle, AlertTriangle, Loader2, ChevronRight } from 'lucide-react';
import { useWorkflow } from '../../store/WorkflowContext';
import { mockApi } from '../../api/mockApi';
import { validateWorkflow } from '../../utils/validateWorkflow';
import type { ValidationError } from '../../utils/validateWorkflow';
import type { SimulationStep, NodeType } from '../../types/workflow';

interface SimulationPanelProps {
  onClose: () => void;
}

const NODE_TYPE_COLOR: Record<NodeType, string> = {
  startNode:     'bg-green-100 text-green-800 border-green-300',
  taskNode:      'bg-blue-100 text-blue-800 border-blue-300',
  approvalNode:  'bg-amber-100 text-amber-800 border-amber-300',
  automatedNode: 'bg-purple-100 text-purple-800 border-purple-300',
  endNode:       'bg-red-100 text-red-800 border-red-300',
};

const StatusIcon: React.FC<{ status: SimulationStep['status'] }> = ({ status }) => {
  if (status === 'success') return <CheckCircle size={18} className="text-green-500 shrink-0" />;
  if (status === 'error')   return <XCircle size={18} className="text-red-500 shrink-0" />;
  return <Loader2 size={18} className="text-slate-400 animate-spin shrink-0" />;
};

export const SimulationPanel: React.FC<SimulationPanelProps> = ({ onClose }) => {
  const { nodes, edges } = useWorkflow();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'failed'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRun = useCallback(async () => {
    setSteps([]);
    setErrorMsg('');
    setStatus('running');

    const errors = validateWorkflow(nodes, edges);
    setValidationErrors(errors);
    const hasBlockingErrors = errors.some(e => e.severity === 'error');

    if (hasBlockingErrors) {
      setStatus('failed');
      return;
    }

    try {
      const result = await mockApi.simulate({ nodes, edges });
      // Animate steps in one by one
      for (let i = 0; i < result.length; i++) {
        await new Promise(r => setTimeout(r, 400));
        setSteps(prev => [...prev, result[i]]);
      }
      setStatus('done');
    } catch (err: any) {
      setErrorMsg(err.message || 'Simulation failed.');
      setStatus('failed');
    }
  }, [nodes, edges]);

  const payload = JSON.stringify({ nodes, edges }, null, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-orange-200">
          <div>
            <h2 className="text-lg font-bold text-orange-500">Workflow Sandbox</h2>
            <p className="text-xs text-orange-700">Validate and simulate your workflow step-by-step.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Workflow summary */}
          <div className="flex gap-4">
            <div className="flex-1 bg-orange-200 border border-orange-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-black">{nodes.length}</div>
              <div className="text-xs text-black">Nodes</div>
            </div>
            <div className="flex-1 bg-orange-200 border border-orange-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-black">{edges.length}</div>
              <div className="text-xs text-black">Connections</div>
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-orange-500">Validation Results</h3>
              {validationErrors.map((err, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 p-3 rounded-md text-sm border ${
                    err.severity === 'error'
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}
                >
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  {err.message}
                </div>
              ))}
            </div>
          )}

          {/* Simulation Log */}
          {steps.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-orange-500 mb-3">Execution Log</h3>
              <div className="space-y-2">
                {steps.map((step, i) => (
                  <div
                    key={step.nodeId + i}
                    className="flex items-start gap-3 p-3 border border-orange-200 rounded-lg bg-orange-200 animate-fade-in"
                  >
                    <div className="flex items-center gap-2 shrink-0 pt-0.5">
                      <span className="text-xs text-slate-900 w-5 text-right">{i + 1}</span>
                      <ChevronRight size={14} className="text-slate-300" />
                      <StatusIcon status={step.status} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-slate-800 truncate">{step.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${NODE_TYPE_COLOR[step.nodeType] || 'bg-slate-100 text-slate-600'}`}>
                          {step.nodeType.replace('Node', '')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{step.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completion / Error messages */}
          {status === 'done' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm font-medium">
              <CheckCircle size={18} />
              Simulation completed successfully.
            </div>
          )}
          {status === 'failed' && !validationErrors.some(e => e.severity === 'error') && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              <XCircle size={18} />
              {errorMsg}
            </div>
          )}

          {/* Serialized JSON */}
          <details className="group">
            <summary className="cursor-pointer text-xs font-semibold text-white hover:text-orange-700 select-none">
              View Workflow JSON payload
            </summary>
            <pre className="mt-2 p-3 bg-black text-green-400 text-xs rounded-md overflow-auto max-h-48 leading-relaxed">
              {payload}
            </pre>
          </details>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-orange-200 flex items-center justify-between gap-3 bg-slate-900 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white border border-orange-500 rounded-md hover:bg-orange-500 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleRun}
            disabled={status === 'running'}
            className="flex items-center gap-2 px-5 py-2 bg-slate-600 text-white rounded-md text-sm font-medium hover:bg-[#3ec604] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {status === 'running' ? (
              <><Loader2 size={16} className="animate-spin" /> Simulating…</>
            ) : (
              <><Play size={16} style={{}}/> Run Simulation</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
