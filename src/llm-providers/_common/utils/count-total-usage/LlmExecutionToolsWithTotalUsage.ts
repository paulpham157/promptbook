import type { Observable } from 'rxjs';
import type { LlmExecutionTools } from '../../../../execution/LlmExecutionTools';
import type { PromptResultUsage } from '../../../../execution/PromptResultUsage';

/**
 * LLM tools with option to get total usage of the execution
 */
export type LlmExecutionToolsWithTotalUsage = LlmExecutionTools & {
    /**
     * Get total cost of the execution up to this point
     */
    getTotalUsage(): PromptResultUsage;

    /**
     * Observable of total cost of the execution up to this point
     *
     * Note: This does report the cost of the last prompt, not the total cost of the execution up to this point
     */
    spending(): Observable<PromptResultUsage>;
};

/**
 * TODO: [👷‍♂️] @@@ Manual about construction of llmTools
 * Note: [🥫] Not using getter `get totalUsage` but `getTotalUsage` to allow this object to be proxied
 */
