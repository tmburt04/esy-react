#!/usr/bin/env node --no-warnings

const { ClaudeModel, askClaudeSonnet } = require("../src/providers/anthropic.provider");
const { LocalLlama3bModel, askLlama3b } = require("../src/providers/llama.provider");
const { askOpenAiO1Mini, O1MiniModel, Gpt4oMiniModel, askChatGpt4oMini } = require("../src/providers/openai.provider");
const { reactPageFactory } = require("../src/services/_templates/esyr/src/pages");
const { prompt } = require("inquirer");

/**
 * 
* Dev testing file for AI provider selection and code generation.
* Prompts user to select an AI model and generates credit card validation code.
* FOR DEVELOPMENT/TESTING PURPOSES ONLY.
*
*/

// Do not expose warnings to the user
process.removeAllListeners('warning')

const FullModelList = [
  LocalLlama3bModel,
  ClaudeModel,
  O1MiniModel,
  Gpt4oMiniModel
];

return (async () => {
  const fileType = 'Page';
  const pageName = 'NewPage';
  const pagePath = 'src/pages/' + pageName;
  const codePrompt = `\nA ${fileType} with the name "${pageName}" that captures a credit card from a user and verifies that it is valid.`;

  const { aiProviderPref } = await prompt([
    {
      type: 'list',
      name: 'aiProviderPref',
      message: `What AI model would you like to use?\n`,
      default: FullModelList[0].value,
      choices: FullModelList,
    }
  ]);
  let codeResult = ""
  
  const dftModel = FullModelList.find(m => m.value == aiProviderPref);
  switch (dftModel.value) {
    case Gpt4oMiniModel.value:
      codeResult = await askChatGpt4oMini(codePrompt, fileType);
      break;
    case O1MiniModel.value:
      codeResult = await askOpenAiO1Mini(codePrompt, fileType);
      break;
    case ClaudeModel.value:
      codeResult = await askClaudeSonnet(codePrompt, fileType);
      break;
    case LocalLlama3bModel.value:
    default:
      codeResult = await askLlama3b(codePrompt, fileType);
      break;
  }
  await reactPageFactory({
    pageName,
    pagePath,
    fileOverwrite: codeResult,
    useSass: false,
    useTypeScript: false
  });
})();