const indexComponentContent = ({ projectName }) => `// src/index.tsx
import React from 'react';
import {createRoot} from 'react-dom/client'
import {App} from './App';

const root = createRoot(document.getElementById('${projectName + '-root'}')!)
root.render(<App />)`;

module.exports = { indexComponentContent };