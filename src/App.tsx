import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { WorkflowProvider } from './store/WorkflowContext';
import { Layout } from './components/Layout';
import { BrowserRouter } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <WorkflowProvider>
        <ReactFlowProvider>
          <Layout />
        </ReactFlowProvider>
      </WorkflowProvider>
    </BrowserRouter>
  );
};

export default App;
