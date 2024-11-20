# ESY React Changelog

### 2.0.9
- Exponential backoff for Third party API calls.
- Updated documentation

### 2.0.8
- Made paths configurable for all commands.

### 2.0.7
- Improved verbiage on overwrite cancellation prompts.
- Issue template for easier bug reporting.
- Documentation updates.

### 2.0.6
- `esyr reset` command removes the local env file that has API keys and any user preferences.
- Version number now displays in the CLI.
- Improved error handling.

### 2.0.5
- Sample page and component code did not return JSX. Fixed.

### 2.0.4
- Fixed broken LLM calls

### 2.0.3
- Fixed bad references from code refactor

### 2.0.2
- Project directory restructure to meet standards.
- Allow custom paths for 'pages' and 'components' commands.


### 2.0.1
- Abstracted env file references to allow for more custom features and settings.
- Progress bar on all API calls.
- Hehe - Jokes :-)


### 2.0.0
- `esyr component` now offers code generation with Claude Sonnet.
- `esyr page` now offers code generation with Claude Sonnet.
- Optional file overwrite for all commands. (existing files)
- Optional file overwrite for all commands. (existing files)
- Added a meta-DX feature to allow for ease of install locally.


### 1.1.3
- Fixed `esyr hook` command not working properly
- Fixed `esyr page` command not building component properly
- Fixed `esyr component` command now has optional props


### 1.1.2
- Added links for NPM package registry


### 1.1.1
- Added ChangeLog
- Fixed outdated README.md
- Released to Official NPM registry
- Fixed `esyr project` command not scaffolding directories properly
- Added auto-format to build + hot reload process