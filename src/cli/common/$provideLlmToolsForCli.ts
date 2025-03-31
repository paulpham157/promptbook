import colors from 'colors';
import prompts from 'prompts';
import type { CacheLlmToolsOptions } from '../../llm-providers/_common/utils/cache/CacheLlmToolsOptions';
import type { ErrorJson } from '../../errors/utils/ErrorJson';
import type { PromptbookServer_Identification } from '../../remote-server/socket-types/_subtypes/PromptbookServer_Identification';
import type { string_url } from '../../types/typeAliases';
import { isValidEmail } from '../../utils/validators/email/isValidEmail';
import { isValidUrl } from '../../utils/validators/url/isValidUrl';
import { CLI_APP_ID } from '../../config';
import { UnexpectedError } from '../../errors/UnexpectedError';
import { $provideLlmToolsForWizzardOrCli } from '../../llm-providers/_common/register/$provideLlmToolsForWizzardOrCli';
import type { really_unknown } from '../../utils/organization/really_unknown';

type ProvideLlmToolsForCliOptions = Pick<CacheLlmToolsOptions, 'isCacheReloaded'> & {
    cliOptions: {
        verbose: boolean;
        interactive: boolean;
        provider: 'BYOK' | 'BRING_YOUR_OWN_KEYS' | 'REMOTE_SERVER' | 'RS' | string;
        remoteServerUrl: string_url;
    };
};

/**
 * @private utility of CLI
 */
export function $provideLlmToolsForCli(options: ProvideLlmToolsForCliOptions) {
    const {
        cliOptions: {
            /* TODO: Use verbose: isVerbose, */ interactive: isInteractive,
            provider,
            remoteServerUrl: remoteServerUrlRaw,
        },
    } = options;

    let strategy: 'BRING_YOUR_OWN_KEYS' | 'REMOTE_SERVER';

    if (/^b/i.test(provider)) {
        strategy = 'BRING_YOUR_OWN_KEYS';
    } else if (/^r/i.test(provider)) {
        strategy = 'REMOTE_SERVER';
    } else {
        console.log(colors.red(`Unknown provider: "${provider}", please use "BRING_YOUR_OWN_KEYS" or "REMOTE_SERVER"`));
        process.exit(1);
    }

    if (strategy === 'BRING_YOUR_OWN_KEYS') {
        return /* not await */ $provideLlmToolsForWizzardOrCli({ strategy, ...options });
    } else if (strategy === 'REMOTE_SERVER') {
        if (!isValidUrl(remoteServerUrlRaw)) {
            console.log(colors.red(`Invalid URL of remote server: "${remoteServerUrlRaw}"`));
            process.exit(1);
        }

        const remoteServerUrl = remoteServerUrlRaw.endsWith('/') ? remoteServerUrlRaw.slice(0, -1) : remoteServerUrlRaw;

        return /* not await */ $provideLlmToolsForWizzardOrCli({
            strategy,
            appId: CLI_APP_ID,
            remoteServerUrl,
            ...options,
            async loginPrompt() {
                if (!isInteractive) {
                    console.log(colors.red(`You can not login to remote server in non-interactive mode`));
                    process.exit(1);
                }

                const { username, password } = await prompts([
                    {
                        type: 'text',
                        name: 'username',
                        message: 'Enter your email:', // <- TODO: [🧠] What is the message here, asking for email but outputting username
                        validate: (value) => (isValidEmail(value) ? true : 'Valid email is required'),
                    },
                    {
                        type: 'password',
                        name: 'password',
                        message: 'Enter your password:', // <- TODO: [🧠] What is the message here
                        validate: (value) =>
                            value.length /* <- TODO: [🧠] Better password validation */ > 0
                                ? true
                                : 'Password is required',
                    },
                ]);

                const loginUrl = `${remoteServerUrl}/login`;
                const response = await fetch(loginUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        appId: CLI_APP_ID,
                        username,
                        password,
                    }),
                });

                console.log('!!!', {
                    loginUrl,
                    username,
                    password,
                    // type: response.type,
                    // text: await response.text(),
                });

                const body = (await response.json()) as
                    | { error: ErrorJson }
                    | { identification: PromptbookServer_Identification<really_unknown> };

                if ('error' in body) {
                    console.log(colors.red(body.error.message));
                    process.exit(1);
                }

                return body.identification;
            },
        });
    } else {
        throw new UnexpectedError(`\`$provideLlmToolsForCli\` wrong strategy "${strategy}"`);
    }
}
