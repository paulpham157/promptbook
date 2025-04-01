import type { CommonToolsOptions } from '../../execution/CommonToolsOptions';
import type { string_base_url } from '../../types/typeAliases';
import type { Identification } from '../socket-types/_subtypes/Identification';

/**
 * Options for `RemoteLlmExecutionTools`
 *
 * @public exported from `@promptbook/remote-client`
 */
export type RemoteClientOptions<TCustomOptions> = CommonToolsOptions & {
    /**
     * URL of the remote server
     * On this server will be connected to the socket.io server
     */
    readonly remoteServerUrl: string_base_url;

    /**
     * Identification of client for Socket.io remote server
     */
    readonly identification: Identification<TCustomOptions>;
};

/**
 * TODO: Pass more options from Socket.io to `RemoteClientOptions` (like `transports`)
 * TODO: [🧠][🛍] Maybe not `isAnonymous: boolean` BUT `mode: 'ANONYMOUS'|'COLLECTION'`
 * TODO: [🧠][🧜‍♂️] Maybe join remoteServerUrl and path into single value
 */
