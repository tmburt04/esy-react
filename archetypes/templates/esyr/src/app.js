const appComponentContent = ({ useTypeScript, pageName }) => `import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ${pageName} from './pages/${pageName}';

const router = createBrowserRouter([
  {
    element: <${pageName} />,
    children: [],
  },
]);

export const App${!useTypeScript ? '' : `: React.FC`} = () => {
  return <RouterProvider router={router} />;
}
  `;

module.exports = { appComponentContent };