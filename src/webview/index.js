import React from 'react';
import { createRoot } from 'react-dom/client';
import DBMLPreview from './components/DBMLPreview';

const isVSCode = typeof acquireVsCodeApi === 'function';

let vscode;
if (isVSCode) {
  vscode = acquireVsCodeApi();
} else {
  // Mock the vscode API for the browser environment
  vscode = {
    postMessage: (message) => {
      console.log('Message to VS Code (mocked):', message);
    },
    getState: () => ({}),
    setState: () => {},
  };
}

// Make vscode API available globally
window.vscode = vscode;

try {
  const container = document.getElementById('root');

  if (!container) {
    console.error('Root container not found!');
  } else {
    try {
      const root = createRoot(container);

      function App() {
        const initialContent = window.initialContent;
        
        try {
          return <DBMLPreview initialContent={initialContent} />;
        } catch (error) {
          console.error('Error in DBMLPreview component:', error);
          return <div style={{color: 'red', padding: '20px'}}>Error: {error.message}</div>;
        }
      }

      root.render(<App />);
      
    } catch (error) {
      console.error('Error creating React root or rendering:', error);
      container.innerHTML = `<div style="color: red; padding: 20px;">React Error: ${error.message}</div>`;
    }
  }
} catch (error) {
  console.error('Critical error in webview script:', error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">Critical Error: ${error.message}</div>`;
}