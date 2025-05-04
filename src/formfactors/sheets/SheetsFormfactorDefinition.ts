import type { AbstractFormfactorDefinition } from '../_common/AbstractFormfactorDefinition';

/**
 * Sheets is form of app that processes tabular data in CSV format, allowing transformation
 * and analysis of structured data through AI-powered operations
 *
 * @public exported from `@promptbook/core`
 */
export const SheetsFormfactorDefinition = {
    name: 'SHEETS',
    aliasNames: ['SHEETS', 'SHEET'],
    description: `A formfactor for processing spreadsheet-like data in CSV format, enabling AI transformations on tabular data`,
    documentationUrl: `https://github.com/webgptorg/promptbook/discussions/176`,
    pipelineInterface: {
        inputParameters: [
            {
                name: 'inputSheet',
                description: `Input sheet to be processed as csv`,
                isInput: true,
                isOutput: false,
            },
        ],
        outputParameters: [
            {
                name: 'outputSheet',
                description: `Output sheet as csv`,
                isInput: false,
                isOutput: true,
            },
        ],
    },
} as const satisfies AbstractFormfactorDefinition;
