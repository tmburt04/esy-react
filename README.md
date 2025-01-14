<!-- Render ESYR logo -->
![ESy React CLI Logo](./.documentation/esyr-logo.svg)

# ESy React CLI
## Description
`esy-react-cli` is a minimalist, yet robust command-line interface tool designed to accelerate ReactJS development. By automating component creation and project scaffolding, `esy-react-cli` aims to boost developer productivity and efficiency. Named after the build tool it uses, "ESBuild", the CLI leverages cutting-edge technology to deliver a fast, lightweight, and user-friendly development experience. With optional AI-powered features, `esy-react-cli` offers intelligent code generation capabilities to further enhance the development process.

## AI Integration

**NOTE: The CLI maintains full functionality without AI integration, ensuring developers have complete control over their development experience.**

`esy-react-cli` includes optional AI-powered features that are disabled by default and require explicit user opt-in to enhance the development experience. All AI capabilities are implemented with complete transparency - the source code is open for review on GitHub, and the project maintains a strict policy regarding API key management, where keys are never stored within the codebase. For security and privacy, users manage their own API keys locally through environment variables, with no keys ever transmitted to or stored on the project's servers. The CLI maintains full functionality without AI integration, ensuring developers have complete control over their development experience.

### Security Transparency
We believe in transparency and security. All AI capabilities are implemented with complete transparency - the source code is open for review on GitHub, and the project maintains a strict policy regarding API key management, where keys are never stored within the codebase. For security and privacy, users manage their own API keys locally through environment variables, with no keys ever transmitted to or stored on the project's servers. [Read More](https://github.com/tmburt04/esy-react/blob/main/.github/SECURITY.md)


## Key Features
**Minimal Footprint**       
```
Creating a project with `esy-react-cli` in no way locks you into using ESYR forever! The CLI is designed to be lightweight and non-intrusive, allowing you to switch to other tools or workflows at any time.
```
**Streamlined React Building**      
```
Generate perfect pages and reusable components and hooks with `esyr component`, saving time and promoting consistency.
```
**Scaffold Dynamic Directory Structures & File Structures**     
```
Override the default paths for **all** commands and scaffold using your own .
```
**Transparent Security** 
[Read More](https://github.com/tmburt04/esy-react/blob/main/.github/SECURITY.md)     
```
The AI capabilities are fully open-source and respect user privacy by enabling local API key.
```
**Intelligent Scaffolding**      
```     
Leverage AI-powered features to scaffold pages, components, and other project elements (optional).
```
## Usage
Once installed, you can start using `esy-react-cli` to create new React projects and manage your components. Refer to the [Commands](#commands) section for a list of available commands and their descriptions.

**Supported Models:**
| Id | Model | Vendor | API Access |
| ---| --- | --- | --- |
| `llama-3.2-3b` | Llama 3.2 3b (Q8) | Meta Llama | (FREE/Local) |
| `claude-3-sonnet-20240229` | Claude Sonnet (new) | Anthropic | https://www.anthropic.com/api |
| `gpt-4o-mini` | GPT-4o mini | OpenAI | https://platform.openai.com/docs/models/gpt-4o-mini#gpt-4o-mini |
| `o1-mini` | o1 mini | OpenAI | https://platform.openai.com/docs/models/o1-mini#o1 |

## NPM Registry Installation
1. `npm i -g esy-react-cli`

## Local Installation
1. ___cd into the project directory___
2. `npm i`
3. `npm run link`

## Default Folder Structure
Settings are stored in a `.env` file in the root of the project or cli installation. On first run of each command, the user will be prompted to set a custom path for future use of that command. The default structure is as follows:
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

To clear out settings and any api keys set, run `esyr reset`.

## Commands
| Cmd | Short Cmd | Description | AI Support |
| --- | --- | --- | --- |
| `esyr project` | `esyr proj` | Create a new react project | - |
| `esyr page` | `esyr p` | Create a page in a react project | ✓ |
| `esyr component` | `esyr c` | Create a component in a react project | ✓ |
| `esyr hook` | `esyr h` | Creates a hook for a react project | ✓ |
| `esyr context` | `esyr ctx` | Creates a context + provider for a react project | - |
| `esyr service-worker` | `esyr sw` | Create a service worker in a react project | ✓ |
| `esyr browser-ext` | `esyr ext` | WIP - Initializes a react project as a browser ext (experimental) | - |
| `esyr content-script` | `esyr cs` | WIP - Creates a content script for a react project that has a browser ext (experimental) | - |
| `esyr reset` | `esyr rs` | Removes the local env file that has API keys and any user preferences. | - |

## Release Notes
### **v3.0**
- FREE Code Generation (local llama)
- Added OpenAI's o1-mini reasoning model as an option for code generation.
- Improved Code Generation

### **v2.2**
- New and improved code generation across ALL supported commands!
- Optional ability to create sub-projects with `eysr project` command.
- API keys can now be re-used across projets/repos!

### **v2.1**
- Fixed bug with `esyr proj` command not setting the project root properly.
- Service workers can now be generated with the `esyr sw` command.
- Added OpenAI's gpt-4o model as an option for code generation.
- `esyr p` is now a shortcut for `esyr page`

### **v2**
- `esyr page` and `esyr component` now offer code generation with Claude Sonnet.
- Optional path setting for all commands.
- Optional file overwrite for all commands. (existing files)
- Added a meta-DX feature to allow for ease of install locally.
- Config reset command added.
- Added fun messages to commands for a more enjoyable experience.

### **Early Access/v1**
- Scaffold a new React project with `esyr project` and create various components.

## Feature Roadmap
- More intelligent code generation that is tailored to the project.

## Contributing
We welcome contributions from the community! If you find any issues or have suggestions for improvements, please feel free to open a GitHub issue or submit a pull request.

If you excel at prompt engineering, please review my System Prompt! I'd love to hear your thoughts on how to improve it. [System Prompt](https://github.com/tmburt04/esy-react/blob/main/src/system-prompts/react-fc-v2.js)

## Issues/Bugs
If you encounter any issues or bugs while using `esy-react-cli`, please report them on the [GitHub Issues](https://github.com/tmburt04/esy-react/issues/new) page. Use the provided issue template to ensure that your bug report contains all the necessary information for us to investigate and address the problem.

## License
This project is licensed under the [MIT License](LICENSE).