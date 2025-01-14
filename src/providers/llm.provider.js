const { askClaudeSonnet, ClaudeModel } = require("./anthropic.provider");
const { askLlama3b, LocalLlama3bModel } = require("./llama.provider");
const { prompt } = require("inquirer");
const { setEnvVar, getEnvVar } = require("../utils/env.util");
const { askChatGpt4oMini, askOpenAiO1Mini, Gpt4oMiniModel, O1MiniModel } = require("./openai.provider");

const FullModelList = [
    LocalLlama3bModel,
    ClaudeModel,
    O1MiniModel,
    Gpt4oMiniModel
];

/**
 * @function tryAskLLM
 * @param {string} fileType The type of React file being generated (component|service worker|hook)
 * @param {string} fileName The name of the file or component
 * @description Tries to ask AI with a prompt to generate code
 * @returns {string} The code generated by AI or undefined if the user chose not to use AI
 */
async function tryAskLLM(fileType = 'component', fileName = '') {
    // Prompt user if they want to give a description to claude
    let codeResult;

    let dftModelId = await getEnvVar('DEFAULT_MODEL_ID');

    console.log('\n')
    const promptPrefix = `\nA ${fileType}${fileName?.length > 0 ? ` with the name "${fileName}" ` : ' '}`;
    const { userPrompt } = await prompt([
        {
            type: 'input',
            suffix: promptPrefix + '...',
            name: 'userPrompt',
            message: `Describe your ${fileType} in detail and generate a first draft w/AI!\n (ignore and press ENTER to not use AI)\n`,
        },
    ]);
    if (userPrompt) {
        const _modelPrefFrequency = await getEnvVar('AI_MODEL_PREF_CHG_FREQ');
        if (!dftModelId || !_modelPrefFrequency || _modelPrefFrequency === 'EACH_TIME') {
            console.log('\n')
            const { aiProviderPref } = await prompt([
                {
                    type: 'list',
                    name: 'aiProviderPref',
                    message: `What AI model would you like to use?\n`,
                    default: dftModelId || FullModelList[0].value,
                    choices: FullModelList,
                }
            ]);

            if (!dftModelId) {
                const { modelPrefFrequency } = await prompt([
                    {
                        type: 'list',
                        name: 'modelPrefFrequency',
                        message: `How often would you like select a specific model?\n`,
                        default: 'ALWAYS_ASK',
                        choices: [
                            {
                                name: 'Ask for each command',
                                short: 'Ask each time',
                                value: 'ALWAYS_ASK',
                            },
                            {
                                name: 'Always use this model',
                                short: 'Always this model',
                                value: 'NEVER_ASK',
                            },
                        ],
                    },
                ]);
                await setEnvVar('AI_MODEL_PREF_CHG_FREQ', modelPrefFrequency);
            }

            dftModelId = aiProviderPref;
            await setEnvVar('DEFAULT_MODEL_ID', dftModelId, true);
        }

        const dftModel = FullModelList.find(m => m.value == dftModelId);
        if (!dftModel) {
            throw new Error(`Model with ID '${dftModelId || ''}' not found`);
        }
        try {
            switch (dftModel.value) {
                case Gpt4oMiniModel.value:
                    codeResult = await askChatGpt4oMini(promptPrefix + userPrompt, fileType);
                    break;
                case O1MiniModel.value:
                    codeResult = await askOpenAiO1Mini(promptPrefix + userPrompt, fileType);
                    break;
                case ClaudeModel.value:
                    codeResult = await askClaudeSonnet(promptPrefix + userPrompt, fileType);
                    break;
                case LocalLlama3bModel.value:
                default:
                    codeResult = await askLlama3b(promptPrefix + userPrompt, fileType);
                    break;
            }
        } catch (error) {
            console.log('\n\n');
            throw new Error(error.message);
        }

        return codeResult;
    } else if (!userPrompt) {
        console.log('\n');
        return;
    }
}



module.exports = { tryAskLLM };