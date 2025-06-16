import { NotYetImplementedError } from '../../errors/NotYetImplementedError';
import type { LlmExecutionToolsConstructor } from '../../execution/LlmExecutionToolsConstructor';
import { $isRunningInBrowser } from '../../utils/environment/$isRunningInBrowser';
import { $isRunningInWebWorker } from '../../utils/environment/$isRunningInWebWorker';
import { OpenAiExecutionTools } from './OpenAiExecutionTools';
import type { OpenAiExecutionToolsOptions } from './OpenAiExecutionToolsOptions';

/**
 * Execution Tools for calling OpenAI API
 *
 * Note: This can be also used for other OpenAI compatible APIs, like Ollama
 *
 * @public exported from `@promptbook/openai`
 */
export const createOpenAiExecutionTools = Object.assign(
    (options: OpenAiExecutionToolsOptions): OpenAiExecutionTools => {
        if (($isRunningInBrowser() || $isRunningInWebWorker()) && !options.dangerouslyAllowBrowser) {
            options = { ...options, dangerouslyAllowBrowser: true };
        }

        if (options.isProxied) {
            throw new NotYetImplementedError(`Proxy mode is not yet implemented in createOpenAiExecutionTools`);
        }

        return new OpenAiExecutionTools(options);
    },
    {
        packageName: '@promptbook/openai',
        className: 'OpenAiExecutionTools',
    },
) satisfies LlmExecutionToolsConstructor;

/**
 * TODO: [🦺] Is there some way how to put `packageName` and `className` on top and function definition on bottom?
 * TODO: [🎶] Naming "constructor" vs "creator" vs "factory"
 */
