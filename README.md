# ESY React App
This is a minimalist React template CLI tool that helps you scaffold new react apps with ease.

## NPM Registry Installation
1. `npm i -g esy-react-cli`

## Local Installation
1. ___cd into the project directory___
2. `npm i`
3. `npm run link`

## Folder Structure
{project name}/
├── public/
├── scripts/
├── src/
│   ├── pages/{page name}/
│   ├── components/{component name}/
│   ├── contexts/
│   ├── hooks/
│   ├── workers/
│   ├── content-scripts/
│   ├── pop-ups/

## Commands
| Cmd | Short Cmd | Description |
| --- | --- | --- |
| `esyr project` | `esyr p` | Create a new react project |
| `esyr page` | N/A | Create a page in a react project |
| `esyr component` | `esyr c` | Create a component in a react project |
| `esyr hook` | `esyr h` | Creates a context + provider for a react project |
| `esyr context` | `esyr ctx` | Creates a context + provider for a react project |
| `esyr service-worker` | `esyr sw` | Create a service worker in a react project |
| `esyr browser-ext` | `esyr ext` | WIP - Initializes a react project as a browser ext (experimental) |
| `esyr content-script` | `esyr cs` | WIP - Creates a content script for a react project (browser ext ONLY) |
