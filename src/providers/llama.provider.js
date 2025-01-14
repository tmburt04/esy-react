const { reactSysPromptFactory } = require("../system-prompts/react-fc-v2");
const { SW_SYSTEM_PROMPT } = require("../system-prompts/service-worker");
const { ProgressUtil } = require("../utils/progress.util");
const { ApiProvider } = require("./api-provider");
const { ProjectProvider } = require("./project.provider");
const { findNearestProject } = require("../utils/project.util");
const path = require('path');
const fs = require('fs');
const os = require('os');

const LocalLlama3bModel = {
    vendor: 'Meta',
    value: 'llama-3.2-3b',
    short: 'Llama 3.2 3b',
    name: 'Llama 3.2 3b (Local/FREE)',
    modelUri: "https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/blob/main/Llama-3.2-3B-Instruct-Q8_0.gguf"
  }

/**
 * 
 * @param prompt The prompt to send to the model 
 * @param sysPromptType The type of system prompt to use (e.g. 'component' or 'service worker' or 'hook')
 *  @param model The model object to use for the request
 * 
 * @returns 
 */
async function askLlama(prompt, sysPromptType, model) {
    console.log('\n')
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
        progress.start(`Loading ${model.short}...`);
        const cachePath = path.join(os.homedir(), '.esyr-cli', 'static/models');

        // Create the path if it does not exist
        if (!fs.existsSync(cachePath)) {
            fs.mkdirSync(cachePath, { recursive: true });
        }
        const { getLlama, LlamaChatSession, resolveModelFile } = await import("node-llama-cpp");

        const modelPath = await resolveModelFile(
            model.modelUri,
            cachePath
        );

        // Initialize llama.cpp binding
        const llama = await getLlama();

        // Load model with specific parameters
        const modelInstance = await llama.loadModel({
            modelPath,
            contextSize: 2048,  // Max tokens for context window
            temperature: 0.8,    // Controls randomness (0=deterministic, 1=creative)
            ignoreMemorySafetyChecks: true,
        });

        // Create inference context and chat session
        const context = await modelInstance.createContext();
        const session = new LlamaChatSession({
            systemPrompt: sysPrompt,
            contextSequence: context.getSequence() // Maintains conversation history
        });

        progress.updateMessage(`Prompting ${model.short}...`);
        const response = await session.prompt(prompt); // Generate model response

        progress.stop();
        return response;

    } catch (error) {
        progress.stop();
        throw error;
    }
}

module.exports = {
    LocalLlama3bModel,
    askLlama3b: (prompt, sysPromptType) => askLlama(prompt, sysPromptType, LocalLlama3bModel)
};