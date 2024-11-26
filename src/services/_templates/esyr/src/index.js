const { kebabCase } = require("lodash");

const indexComponentContent = ({ projectName }) => {
    const kebabName = kebabCase(projectName) + '-root';
    return `// src/index.tsx
import React from 'react';
import {createRoot} from 'react-dom/client'
import {App} from './App';

const root = createRoot(document.getElementById('${kebabName}')!)
root.render(<App />)`;}

module.exports = { indexComponentContent };