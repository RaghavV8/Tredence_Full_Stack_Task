import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { WorkflowProvider } from './store/WorkflowContext';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  return (
    <WorkflowProvider>
      <ReactFlowProvider>
        <Layout />
      </ReactFlowProvider>
    </WorkflowProvider>
  );
};

export default App;
