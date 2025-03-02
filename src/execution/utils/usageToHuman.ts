import spaceTrim from 'spacetrim';
import type { string_markdown } from '../../types/typeAliases';
import type { PromptResultUsage } from '../PromptResultUsage';
import type { UncertainNumber } from '../UncertainNumber';
import { usageToWorktime } from './usageToWorktime';

/**
 * Minimal usage information required to calculate worktime
 */
type PartialPromptResultUsage = Partial<PromptResultUsage> & {
    price: UncertainNumber;
    input: Pick<PromptResultUsage['input'], 'wordsCount'>;
    output: Pick<PromptResultUsage['output'], 'wordsCount' | 'charactersCount'>;
};

/**
 * Function `usageToHuman` will take usage and convert it to human readable report
 *
 * @public exported from `@promptbook/core`
 */
export function usageToHuman(usage: PartialPromptResultUsage): string_markdown {
    const reportItems: Array<string> = [];

    const uncertainNumberToHuman = ({ value, isUncertain }: UncertainNumber) =>
        `${isUncertain ? 'approximately ' : ''}${Math.round(value * 100) / 100}`;

    if (
        usage.price.value > 0.01
        // <- TODO: [🍓][🧞‍♂️][👩🏽‍🤝‍🧑🏻] Configure negligible value - default value to config + value to `UsageToHumanSettings`
    ) {
        reportItems.push(`Cost ${uncertainNumberToHuman(usage.price)} USD`);
    } else {
        reportItems.push(`Negligible cost`);
    }

    const hoursCount = usageToWorktime(usage);
    if (
        hoursCount.value >
        1 / 60
        // <- TODO: [🍓][🧞‍♂️][👩🏽‍🤝‍🧑🏻]
    ) {
        reportItems.push(`Saved ${uncertainNumberToHuman(usageToWorktime(usage))} hours of human time`);
        // TODO: [🍓][🧞‍♂️] Show minutes, seconds, days NOT 0.1 hours
        //     > const duration = moment.duration(hoursCount, 'hours');
        //     > return duration.humanize();
    }

    if (usage.output.charactersCount.value > 0) {
        reportItems.push(`Written ${uncertainNumberToHuman(usage.output.charactersCount)} characters`);
    }

    if (reportItems.length === 0) {
        // Note: For negligible usage, we report at least something
        reportItems.push('Negligible');
    }

    return spaceTrim(
        (block) => `
            Usage:
            ${block(reportItems.map((item) => `- ${item}`).join('\n'))}
        `,
    );
}

/**
 * TODO: [🍓][🧞‍♂️] Use "$1" not "1 USD"
 * TODO: [🍓][🧞‍♂️] Use markdown formatting like "Cost approximately **$1**"
 * TODO: [🍓][🧞‍♂️] Report in minutes, seconds, days NOT 0.1 hours
 * TODO: [🧠] Maybe make from `uncertainNumberToHuman` separate exported utility
 * TODO: [🧠] Maybe use "~" instead of "approximately"
 * TODO: [🏛] Maybe make some markdown builder
 */
