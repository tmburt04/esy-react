const { get } = require("lodash");
const { ProgressUtil } = require("../utils/progress.util");
const { ApiProvider } = require("./api-provider");
const { getRandomWaitingJoke } = require("./joke.provider");
const { SW_SYSTEM_PROMPT } = require("../system-prompts/service-worker");
const { reactSysPromptFactory } = require("../system-prompts/react-fc-v2");
const { ProjectProvider } = require("./project.provider");
const { findNearestProject } = require("../utils/project.util");

/**
 * 
 * @param prompt The prompt to send to the model 
 * @param sysPromptType The type of system prompt to use (e.g. 'component' or 'service worker' or 'hook')
 *  @param model The model object to use for the request
 * @returns 
 */
async function askOpenAi(prompt, sysPromptType, model) {
  const apiKey = await ApiProvider.getApiKey(model.vendor);
  if (!apiKey) {
    console.log('\nAnthropic API key not found. \n\n');
    return;
  }
  let sysPrompt;
  const nearestPublicPath = findNearestProject('', false);
  const packageJson = new ProjectProvider(nearestPublicPath);
  await packageJson.load()
  switch (sysPromptType) {
    case 'sw':
    case 'worker':
    case 'service-worker':
      sysPrompt = SW_SYSTEM_PROMPT;
      break;
    case 'fc':
    case 'function':
    case 'functional':
    case 'functional-component':
    default:
      const depsObj = packageJson.get('dependencies');
      const depsList = Object.entries(depsObj).map(([k, v]) => k)
      const hasTs = depsList?.length && depsList.includes('typescript')
      sysPrompt = reactSysPromptFactory({
        dependencies: depsList,
        typescript: hasTs
      });
      break;
  }

  console.log('\n');
  const progress = new ProgressUtil();
  try {
    const loadingJoke = getRandomWaitingJoke(model.vendor);
    progress.start(loadingJoke);

    const reqBody = {
      "model": model.value,
      "messages": [
        {
          "role": model.hasSysPrompt ? "system" : 'user',
          "content": sysPrompt
        },
        {
          "role": "user",
          "content": prompt
        }
      ]
    }

    if (model.hasSysPrompt) {
      Object.assign(reqBody, {
        "response_format": {
          "type": "text"
        },
        "temperature": 1,
        "max_tokens": 2048,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
      })
    }

    const response = await ApiProvider.fetchWithExpBackoff('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify(reqBody)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${model.vendor} API request failed: ${data.error?.message || response.statusText}`);
    }
    progress.stop();

    const result = get(data, 'choices[0].message.content', '');
    return result;
  } catch (error) {
    progress.stop();
    throw error;
  }
}


const Gpt4oMiniModel = {
  vendor: 'openai',
  value: 'gpt-4o-mini',
  short: 'GPT-4o mini',
  name: 'OpenAI GPT-4o mini (API)',
}

const O1MiniModel = {
  vendor: 'openai',
  value: 'o1-mini',
  short: 'OpenAI o1 mini',
  name: 'OpenAI o1 mini (API)',
  hasSysPrompt: false
}

module.exports = {
  Gpt4oMiniModel,
  O1MiniModel,
  askOpenAiO1Mini: (prompt, sysPromptType) => askOpenAi(prompt, sysPromptType, O1MiniModel),
  askChatGpt4oMini: (prompt, sysPromptType) => askOpenAi(prompt, sysPromptType, Gpt4oMiniModel)
};
