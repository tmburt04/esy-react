# ESY React App
esy-react-cli is a minimalist, yet robust command-line interface tool designed to streamline React development by automating component creation and project scaffolding. 

## Ai Integration
esy-react-cli includes optional AI-powered features that are disabled by default and require explicit user opt-in to enhance the development experience. All AI capabilities are implemented with complete transparency - our source code is open for review on GitHub and we maintain a strict policy regarding API key management where keys are never stored within the project codebase. For security and privacy, users manage their own API keys locally through environment variables, with no keys ever transmitted to or stored on our servers. The CLI maintains full functionality without AI integration, ensuring developers have complete control over their development experience.

**Supported Models:**
- Claude Sonnet (claude-3-sonnet-20240229)
- More? Let me know!

## NPM Registry Installation
1. `npm i -g esy-react-cli`

## Local Installation
1. ___cd into the project directory___
2. `npm i`
3. `npm run link`

## Folder Structure
```
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
```

## Commands
| Cmd | Short Cmd | Description | AI Support |
| --- | --- | --- | --- |
| `esyr project` | `esyr p` | Create a new react project | - |
| `esyr page` | N/A | Create a page in a react project | ✓ |
| `esyr component` | `esyr c` | Create a component in a react project | ✓ |
| `esyr hook` | `esyr h` | Creates a context + provider for a react project | - |
| `esyr context` | `esyr ctx` | Creates a context + provider for a react project | - |
| `esyr service-worker` | `esyr sw` | Create a service worker in a react project | - |
| `esyr browser-ext` | `esyr ext` | WIP - Initializes a react project as a browser ext (experimental) | - |
| `esyr content-script` | `esyr cs` | WIP - Creates a content script for a react project that has a browser ext (experimental) | - |
