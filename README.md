# ESY React App
## Description
`esy-react-cli` is a minimalist, yet robust command-line interface tool designed to streamline React development and compete with popular options like `create-react-app`. By automating component creation and project scaffolding, `esy-react-cli` aims to boost developer productivity and efficiency.

## AI Integration
`esy-react-cli` includes optional AI-powered features that are disabled by default and require explicit user opt-in to enhance the development experience. All AI capabilities are implemented with complete transparency - the source code is open for review on GitHub, and the project maintains a strict policy regarding API key management, where keys are never stored within the codebase. For security and privacy, users manage their own API keys locally through environment variables, with no keys ever transmitted to or stored on the project's servers. The CLI maintains full functionality without AI integration, ensuring developers have complete control over their development experience.

## Key Features
- **Faster Project Setup**: Create a new React project with a single command, `esyr project`.
- **Streamlined Component Creation**: Generate reusable components with `esyr component`, saving time and promoting consistency.
- **Intelligent Scaffolding**: Leverage AI-powered features to scaffold pages, hooks, and other project elements (opt-in).
- **Transparent AI Integration**: The AI capabilities are fully open-source and respect user privacy by enabling local API key management.
- **Minimal Footprint**: `esy-react-cli` is a lightweight tool that avoids bloat, making it a lean alternative to `create-react-app`.

## Usage
Once installed, you can start using `esy-react-cli` to create new React projects and manage your components. Refer to the [Commands](#commands) section for a list of available commands and their descriptions.

**Supported Models:**
| Id | Model | Vendor | API Access |
| ---| --- | --- | --- |
| `claude-3-sonnet-20240229` | Claude Sonnet (new) | Anthropic | https://www.anthropic.com/api |

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

## Contributing
We welcome contributions from the community! If you find any issues or have suggestions for improvements, please feel free to open a GitHub issue or submit a pull request.

## License
This project is licensed under the [MIT License](LICENSE).