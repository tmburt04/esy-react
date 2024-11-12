const { ClaudeModel } = require("./claude.model");
const { getRandomWaitingJoke } = require("../joke.provider");
const { ProgressUtil } = require("../../utils/progress.util");

/**
 * 
 * @param prompt The prompt to send to the model 
 * @param sysPromptType The type of system prompt to use (e.g. 'component' or 'worker')
 * @param apiKey The API key to use for the request
 * @returns 
 */
async function askClaude(prompt, sysPromptType, apiKey) {
    if (!apiKey) {
        throw new Error('API key is required');
    }
    const model = ClaudeModel
    const sysPrompt = model.sysPrompt[sysPromptType];

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model.id,
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

        return data.content[0].text;

    } catch (error) {
        throw error;
    }
}

module.exports = { askClaude };