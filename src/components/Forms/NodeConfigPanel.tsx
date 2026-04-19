import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useWorkflow } from '../../store/WorkflowContext';
import type { MockAction } from '../../types/workflow';
import { mockApi } from '../../api/mockApi';

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-xs font-semibold text-slate-600 mb-1">{children}</label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white text-slate-800 placeholder:text-slate-400"
  />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    rows={3}
    className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white text-slate-800 placeholder:text-slate-400 resize-none"
  />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white text-slate-800"
  >
    {children}
  </select>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-4">
    <Label>{label}</Label>
    {children}
  </div>
);

interface KVPair { key: string; value: string; }

const KVEditor: React.FC<{ pairs: KVPair[]; onChange: (pairs: KVPair[]) => void; label: string }> = ({
  pairs, onChange, label
}) => {
  const add = () => onChange([...pairs, { key: '', value: '' }]);
  const remove = (i: number) => onChange(pairs.filter((_, idx) => idx !== i));
  const update = (i: number, field: 'key' | 'value', val: string) => {
    const updated = [...pairs];
    updated[i] = { ...updated[i], [field]: val };
    onChange(updated);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <Label>{label}</Label>
        <button onClick={add} className="text-primary-500 hover:text-primary-700 flex items-center gap-1 text-xs font-medium">
          <Plus size={12} /> Add
        </button>
      </div>
      {pairs.length === 0 && <p className="text-xs text-slate-400 italic">No entries yet.</p>}
      {pairs.map((pair, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            value={pair.key}
            onChange={(e) => update(i, 'key', e.target.value)}
            placeholder="Key"
            className="flex-1 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary-400"
          />
          <input
            value={pair.value}
            onChange={(e) => update(i, 'value', e.target.value)}
            placeholder="Value"
            className="flex-1 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary-400"
          />
          <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

// ── Start Node Form ──────────────────────────────────────
const StartNodeForm: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => (
  <>
    <Field label="Start Title *">
      <Input value={data.title || ''} onChange={(e) => onChange({ title: e.target.value })} placeholder="e.g. Onboarding Start" />
    </Field>
    <KVEditor
      label="Metadata (Optional)"
      pairs={data.metadata || []}
      onChange={(metadata) => onChange({ metadata })}
    />
  </>
);

// ── Task Node Form ──────────────────────────────────────
const TaskNodeForm: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => (
  <>
    <Field label="Title *">
      <Input value={data.title || ''} onChange={(e) => onChange({ title: e.target.value })} placeholder="e.g. Collect Documents" />
    </Field>
    <Field label="Description">
      <Textarea value={data.description || ''} onChange={(e) => onChange({ description: e.target.value })} placeholder="Task description..." />
    </Field>
    <Field label="Assignee">
      <Input value={data.assignee || ''} onChange={(e) => onChange({ assignee: e.target.value })} placeholder="e.g. John Doe / HR Team" />
    </Field>
    <Field label="Due Date">
      <Input type="date" value={data.dueDate || ''} onChange={(e) => onChange({ dueDate: e.target.value })} />
    </Field>
    <KVEditor
      label="Custom Fields"
      pairs={data.customFields || []}
      onChange={(customFields) => onChange({ customFields })}
    />
  </>
);

// ── Approval Node Form ──────────────────────────────────────
const APPROVER_ROLES = ['Manager', 'HRBP', 'Director', 'VP', 'CEO'];

const ApprovalNodeForm: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => (
  <>
    <Field label="Title *">
      <Input value={data.title || ''} onChange={(e) => onChange({ title: e.target.value })} placeholder="e.g. Manager Approval" />
    </Field>
    <Field label="Approver Role">
      <Select value={data.approverRole || ''} onChange={(e) => onChange({ approverRole: e.target.value })}>
        <option value="">-- Select Role --</option>
        {APPROVER_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
      </Select>
    </Field>
    <Field label="Auto-Approve Threshold (days)">
      <Input
        type="number"
        min={0}
        value={data.autoApproveThreshold ?? ''}
        onChange={(e) => onChange({ autoApproveThreshold: e.target.value ? parseInt(e.target.value) : undefined })}
        placeholder="e.g. 3 (auto-approve after N days)"
      />
    </Field>
  </>
);

// ── Automated Node Form ──────────────────────────────────────
const AutomatedNodeForm: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => {
  const [actions, setActions] = useState<MockAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getAutomations().then((a) => { setActions(a); setLoading(false); });
  }, []);

  const selectedAction = actions.find(a => a.id === data.actionId);

  const handleActionChange = (actionId: string) => {
    onChange({ actionId, actionParams: {} });
  };

  const handleParamChange = (param: string, value: string) => {
    onChange({ actionParams: { ...(data.actionParams || {}), [param]: value } });
  };

  return (
    <>
      <Field label="Title *">
        <Input value={data.title || ''} onChange={(e) => onChange({ title: e.target.value })} placeholder="e.g. Send Welcome Email" />
      </Field>
      <Field label="Action">
        {loading ? (
          <div className="text-xs text-slate-400">Loading actions...</div>
        ) : (
          <Select value={data.actionId || ''} onChange={(e) => handleActionChange(e.target.value)}>
            <option value="">-- Select Action --</option>
            {actions.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
          </Select>
        )}
      </Field>
      {selectedAction && selectedAction.params.length > 0 && (
        <div>
          <Label>Action Parameters</Label>
          <div className="bg-slate-50 rounded p-3 space-y-3 mt-1">
            {selectedAction.params.map(param => (
              <div key={param}>
                <Label>{param.charAt(0).toUpperCase() + param.slice(1)}</Label>
                <Input
                  value={data.actionParams?.[param] || ''}
                  onChange={(e) => handleParamChange(param, e.target.value)}
                  placeholder={`Enter ${param}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// ── End Node Form ──────────────────────────────────────
const EndNodeForm: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => (
  <>
    <Field label="Title *">
      <Input value={data.title || ''} onChange={(e) => onChange({ title: e.target.value })} placeholder="e.g. Workflow Complete" />
    </Field>
    <Field label="End Message">
      <Textarea value={data.endMessage || ''} onChange={(e) => onChange({ endMessage: e.target.value })} placeholder="Message shown on completion..." />
    </Field>
    <div className="mb-4">
      <div className="flex items-center gap-3">
        <button
          role="switch"
          aria-checked={!!data.showSummary}
          onClick={() => onChange({ showSummary: !data.showSummary })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.showSummary ? 'bg-primary-600' : 'bg-slate-300'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${data.showSummary ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
        <span className="text-sm text-slate-700">Show Summary Report</span>
      </div>
    </div>
  </>
);

// ── Main Panel ──────────────────────────────────────────
const FORM_TITLE: Record<string, string> = {
  startNode: 'Start Node',
  taskNode: 'Task Node',
  approvalNode: 'Approval Node',
  automatedNode: 'Automated Step Node',
  endNode: 'End Node',
};

export const NodeConfigPanel: React.FC = () => {
  const { nodes, selectedNodeId, setSelectedNodeId, updateNodeData } = useWorkflow();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  if (!selectedNode) return null;

  const data = selectedNode.data as any;
  const nodeType = selectedNode.type || '';

  const handleChange = (updates: any) => {
    updateNodeData(selectedNode.id, updates);
  };

  const renderForm = () => {
    switch (nodeType) {
      case 'startNode':     return <StartNodeForm data={data} onChange={handleChange} />;
      case 'taskNode':      return <TaskNodeForm data={data} onChange={handleChange} />;
      case 'approvalNode':  return <ApprovalNodeForm data={data} onChange={handleChange} />;
      case 'automatedNode': return <AutomatedNodeForm data={data} onChange={handleChange} />;
      case 'endNode':       return <EndNodeForm data={data} onChange={handleChange} />;
      default:              return <p className="text-sm text-slate-400">No configuration available.</p>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">{FORM_TITLE[nodeType] || 'Node Config'}</h3>
          <p className="text-xs text-slate-400">ID: {selectedNode.id.slice(0, 8)}…</p>
        </div>
        <button onClick={() => setSelectedNodeId(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {renderForm()}
      </div>
    </div>
  );
};
