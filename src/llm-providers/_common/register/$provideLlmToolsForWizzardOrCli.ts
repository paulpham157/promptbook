import { join } from 'path';
import { Promisable } from 'type-fest';
import { MemoryStorage } from '../../../storage/memory/MemoryStorage';
import { UnexpectedError } from '../../../errors/UnexpectedError';
import type { PromptbookServer_Identification } from '../../../remote-server/socket-types/_subtypes/PromptbookServer_Identification';
import type { really_any } from '../../../utils/organization/really_any';
import { DEFAULT_EXECUTION_CACHE_DIRNAME } from '../../../config';
import { DEFAULT_REMOTE_SERVER_URL } from '../../../config';
import { EnvironmentMismatchError } from '../../../errors/EnvironmentMismatchError';
import type { LlmExecutionTools } from '../../../execution/LlmExecutionTools';
import { $provideFilesystemForNode } from '../../../scrapers/_common/register/$provideFilesystemForNode';
import { FileCacheStorage } from '../../../storage/file-cache-storage/FileCacheStorage';
import type { string_app_id } from '../../../types/typeAliases';
import type { string_url } from '../../../types/typeAliases';
import { $isRunningInNode } from '../../../utils/environment/$isRunningInNode';
import { RemoteLlmExecutionTools } from '../../remote/RemoteLlmExecutionTools';
import { cacheLlmTools } from '../utils/cache/cacheLlmTools';
import type { CacheLlmToolsOptions } from '../utils/cache/CacheLlmToolsOptions';
import { countUsage } from '../utils/count-total-usage/countUsage';
import type { LlmExecutionToolsWithTotalUsage } from '../utils/count-total-usage/LlmExecutionToolsWithTotalUsage';
import { $provideLlmToolsFromEnv } from './$provideLlmToolsFromEnv';

type ProvideLlmToolsForWizzardOrCliOptions = Pick<CacheLlmToolsOptions, 'isCacheReloaded'> &
    (
        | {
              /**
               * Use local keys and execute LLMs directly
               */
              readonly strategy: 'BRING_YOUR_OWN_KEYS';
          }
        | {
              /**
               * Do not use local keys but login to Promptbook server and execute LLMs there
               */
              readonly strategy: 'REMOTE_SERVER';

              /**
               * URL of the remote server
               *
               * @default `DEFAULT_REMOTE_SERVER_URL`
               */
              readonly remoteServerUrl?: string_url;

              /**
               * Identifier of the application which will be passed to the remote server identification
               *
               * Note: This can be some id or some semantic name like "email-agent"
               */
              readonly appId: string_app_id;

              /**
               *
               */
              loginPrompt(): Promisable<PromptbookServer_Identification<really_any>>;
          }
    );

/**
 * Returns LLM tools for CLI
 *
 * @private within the repository - for CLI utils
 */
export async function $provideLlmToolsForWizzardOrCli(
    options?: ProvideLlmToolsForWizzardOrCliOptions,
): Promise<LlmExecutionToolsWithTotalUsage> {
    if (!$isRunningInNode()) {
        throw new EnvironmentMismatchError(
            'Function `$provideLlmToolsForWizzardOrCli` works only in Node.js environment',
        );
    }

    options = options ?? { strategy: 'BRING_YOUR_OWN_KEYS' };
    const { strategy, isCacheReloaded } = options;

    let llmExecutionTools: LlmExecutionTools;

    if (strategy === 'REMOTE_SERVER') {
        const { remoteServerUrl = DEFAULT_REMOTE_SERVER_URL, loginPrompt } = options;

        const storage = new MemoryStorage<PromptbookServer_Identification<null>>(); // <- TODO: !!!!!! Save to `.promptbook` folder

        const key = `${remoteServerUrl}-identification`;
        let identification = await storage.getItem(key);

        if (identification === null) {
            identification = await loginPrompt();
            await storage.setItem(key, identification);
        }

        llmExecutionTools = new RemoteLlmExecutionTools({
            remoteServerUrl,
            identification,
        });
    } else if (strategy === 'BRING_YOUR_OWN_KEYS') {
        llmExecutionTools = await $provideLlmToolsFromEnv();
    } else {
        throw new UnexpectedError(`\`$provideLlmToolsForWizzardOrCli\` wrong strategy "${strategy}"`);
    }

    return cacheLlmTools(
        countUsage(
            //        <- TODO: [🌯] We dont use countUsage at all, maybe just unwrap it
            //        <- Note: for example here we don`t want the [🌯]
            llmExecutionTools,
        ),
        {
            storage: new FileCacheStorage(
                { fs: $provideFilesystemForNode() },
                {
                    rootFolderPath: join(
                        process.cwd(),
                        DEFAULT_EXECUTION_CACHE_DIRNAME, // <- TODO: [🦒] Allow to override (pass different value into the function)
                    ),
                },
            ),
            isCacheReloaded,
        },
    );
}

/**
 * Note: [🟢] Code in this file should never be never released in packages that could be imported into browser environment
 * TODO: [👷‍♂️] @@@ Manual about construction of llmTools
 * TODO: [🥃] Allow `ptbk make` without llm tools
 * TODO: This should be maybe not under `_common` but under `utils-internal` / `utils/internal`
 * TODO: [®] DRY Register logic
 */
