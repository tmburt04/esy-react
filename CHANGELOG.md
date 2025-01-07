# ESY React Changelog

### 2.2.0
- All code generation commands now reference the 'package.json', all code generation NOW uses packages already installed in your project!
- All code generation now generates an entire file instead of injecting output in a template.
- Optional ability to create sub-projects with `eysr proj` command.
- API Keys are now stored in the user's home directory in a separate .env file.
- Refactored utility and common logic to be more uniform.
- Fixed bug that caused directories to be pre-maturely created.

### 2.1.2
- Fixed issue with `esyr context` command failing to scaffold.
- The command `esyr context` now allows you to overwrite files.
- Fixed bad link in README.md for OpenAI API key.

### 2.1.1
- Hooks can now be generated with AI using the `esyr hook` command.
- Added logo
- Updated README.md

### 2.1.0
- Service workers can now be generated with AI using the `esyr sw` command.
- Fixed bug with `esyr proj` command not setting the project root properly.
- Added OAI models as options for code generation.
- `esyr p` is now a shortcut for `esyr page`
- Updated documentation

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