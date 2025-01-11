const { reactSysPromptFactory } = require("../system-prompts/react-fc-v2");
const { SW_SYSTEM_PROMPT } = require("../system-prompts/service-worker");
const { ProgressUtil } = require("../utils/progress.util");
const { ApiProvider } = require("./api-provider");
const { ProjectProvider } = require("./project.provider");
const { getRandomWaitingJoke } = require("./joke.provider");
const { findNearestProject } = require("../utils/project.util");


const ClaudeModel = {
    vendor: 'anthropic',
    value: 'claude-3-5-sonnet-20241022',
    short: 'Claude Sonnet',
    name: 'Claude 3.5 Sonnet (API)',
}

/**
 * 
 * @param prompt The prompt to send to the model 
 * @param sysPromptType The type of system prompt to use (e.g. 'component' or 'service worker' or 'hook')
 *  @param model The model object to use for the request
 * 
 * @returns 
 */
async function askAnthropic(prompt, sysPromptType, model) {
    const apiKey = await ApiProvider.getApiKey(model.vendor);
    console.log('\n')
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
        const response = await ApiProvider.fetchWithExpBackoff('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model.value,
                system: sysPrompt,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1024 * 2
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.log('\n\nClaude error response:\n', data);
            throw new Error(`API request failed: ${data.error?.message || response.statusText}`);
        }

        progress.stop();
        return data.content[0].text;

    } catch (error) {
        progress.stop();
        throw error;
    }
}

module.exports = {
    ClaudeModel,
    askClaudeSonnet: (prompt, sysPromptType) => askAnthropic(prompt, sysPromptType, ClaudeModel)
};