const { get } = require("lodash");
const { ProgressUtil } = require("../utils/progress.util");
const { ApiProvider } = require("./api-provider");
const { getRandomWaitingJoke } = require("./joke.provider");
const { SW_SYSTEM_PROMPT } = require("../system-prompts/service-worker");
const { FC_SYSTEM_PROMPT } = require("../system-prompts/react-fc");

/**
 * 
 * @param prompt The prompt to send to the model 
 * @param sysPromptType The type of system prompt to use (e.g. 'fc' or 'worker')
 * @param apiKey The API key to use for the request
 * @returns 
 */
async function askOpenAi(prompt, sysPromptType, model) {
  const apiKey = await ApiProvider.getApiKey(model.vendor);
  if (!apiKey) {
    console.log('\nAnthropic API key not found. \n\n');
    return;
  }
  let sysPrompt;
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
      sysPrompt = FC_SYSTEM_PROMPT;
      break;
  }

  console.log('\n');
  const progress = new ProgressUtil();
  try {
    const loadingJoke = getRandomWaitingJoke(model.vendor);
    progress.start(loadingJoke);
    
    const response = await ApiProvider.fetchWithExpBackoff('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        "model": model.value,
        "response_format": {
          "type": "text"
        },
        "temperature": 1,
        "max_tokens": 2048,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "messages": [
          {
            "role": "system",
            "content": sysPrompt
          },
          {
            "role": "user",
            "content": prompt
          }
        ]
      })
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
  name: 'OpenAI GPT-4o mini (API)'
}

/**
 * @todo figure out why this model is giving inconsistent results
 * Why am i getting a mixture of 403, 400, and 429 errors?
 * Nov-25-2024
 */
const O1MiniModel = {
    vendor: 'openai',
    value: 'o1-mini',
    short: 'OpenAI o1 mini',
    name: 'OpenAI o1 mini (API)',
}

module.exports = {
  Gpt4oMiniModel,
  O1MiniModel,
  askOpenAiO1Mini: (prompt, sysPromptType) => askOpenAi(prompt, sysPromptType, O1MiniModel),
  askChatGpt4oMini: (prompt, sysPromptType) => askOpenAi(prompt, sysPromptType, Gpt4oMiniModel)
};
