import type { AvailableModel } from '../../execution/AvailableModel';
import type { number_usd } from '../../types/typeAliases';
import { exportJson } from '../../utils/serialization/exportJson';
import { pricing } from '../_common/utils/pricing';

/**
 * List of available Deepseek models with descriptions
 *
 * Note: Done at 2025-05-06
 *
 * @see https://www.deepseek.com/models
 * @public exported from `@promptbook/deepseek`
 */
export const DEEPSEEK_MODELS: ReadonlyArray<
    AvailableModel & {
        modelDescription?: string;
        pricing?: {
            readonly prompt: number_usd;
            readonly output: number_usd;
        };
    }
> = exportJson({
    name: 'DEEPSEEK_MODELS',
    value: [
        {
            modelVariant: 'CHAT',
            modelTitle: 'Deepseek Chat',
            modelName: 'deepseek-chat',
            modelDescription:
                'General-purpose language model with strong performance across conversation, reasoning, and content generation. 128K context window with excellent instruction following capabilities.',
            pricing: {
                prompt: pricing(`$0.80 / 1M tokens`),
                output: pricing(`$1.60 / 1M tokens`),
            },
        },
        {
            modelVariant: 'CHAT',
            modelTitle: 'Deepseek Reasoner',
            modelName: 'deepseek-reasoner',
            modelDescription:
                'Specialized model focused on complex reasoning tasks like mathematical problem-solving and logical analysis. Enhanced step-by-step reasoning with explicit chain-of-thought processes. 128K context window.',
            pricing: {
                prompt: pricing(`$3.50 / 1M tokens`),
                output: pricing(`$7.00 / 1M tokens`),
            },
        },
        {
            modelVariant: 'CHAT',
            modelTitle: 'DeepSeek V3',
            modelName: 'deepseek-v3-0324',
            modelDescription:
                'Advanced general-purpose model with improved reasoning, coding abilities, and multimodal understanding. Built on the latest DeepSeek architecture with enhanced knowledge representation.',
            pricing: {
                prompt: pricing(`$1.50 / 1M tokens`),
                output: pricing(`$3.00 / 1M tokens`),
            },
        },
        {
            modelVariant: 'CHAT',
            modelTitle: 'DeepSeek R1',
            modelName: 'deepseek-r1',
            modelDescription:
                'Research-focused model optimized for scientific problem-solving and analytical tasks. Excellent performance on tasks requiring domain-specific expertise and critical thinking.',
            pricing: {
                prompt: pricing(`$5.00 / 1M tokens`),
                output: pricing(`$10.00 / 1M tokens`),
            },
        },
        {
            modelVariant: 'EMBEDDING',
            modelTitle: 'DeepSeek Embedder',
            modelName: 'deepseek-embedder-v1',
            modelDescription: 'High-quality text embedding model',
            pricing: {
                prompt: pricing(`$0.10 / 1M tokens`),
                output: 0,
            },
        },
        {
            modelVariant: 'CHAT',
            modelTitle: 'DeepSeek Vision',
            modelName: 'deepseek-vision-v2',
            modelDescription: 'Multimodal model for image + text tasks',
            pricing: {
                prompt: pricing(`$1.20 / 1M tokens`),
                output: pricing(`$2.40 / 1M tokens`),
            },
        },
        // …add any additional at https://www.deepseek.com/models…
    ],
});

/**
 * TODO: [🧠] Add information about context window sizes, capabilities, and relative performance characteristics
 * TODO: [🎰] Some mechanism to auto-update available models
 * TODO: [🧠] Verify pricing information is current with Deepseek's official documentation
 * Note: [💞] Ignore a discrepancy between file name and entity name
 */
