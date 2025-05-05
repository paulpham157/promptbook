import type { Promisable } from 'type-fest';
import type { KnowledgePiecePreparedJson } from '../../pipeline/PipelineJson/KnowledgePieceJson';
import type {
    string_filename,
    string_knowledge_source_link,
    string_mime_type,
    string_url,
} from '../../types/typeAliases';
import type { ScraperAndConverterMetadata } from './register/ScraperAndConverterMetadata';

/**
 * Interface defining the requirements for scraper implementations.
 * Scrapers are responsible for extracting structured content from various knowledge sources.
 */
export type Scraper = {
    /**
     * Metadata of the scraper which includes title, mime types, etc.
     */
    readonly metadata: ScraperAndConverterMetadata;

    /**
     * Scrapes the markdown file and returns the knowledge pieces or `null` if it can't scrape it
     */
    scrape(
        source: ScraperSourceHandler,
    ): Promisable<ReadonlyArray<Omit<KnowledgePiecePreparedJson, 'sources' | 'preparationIds'>> | null>;
};

/**
 * Handler for accessing and processing content from diverse knowledge sources.
 * Provides standardized methods to interact with files, URLs and raw text sources.
 */
export type ScraperSourceHandler = {
    /**
     * The source of the knowledge
     */
    readonly source: string_knowledge_source_link;

    /**
     * The path to the file, if it is a file
     *
     * Note: Typically one of the `filename` or `url` is set and the other is `null`
     */
    readonly filename: string_filename | null;

    /**
     * The URL, if it is online
     *
     * Note: Typically one of the `filename` or `url` is set and the other is `null`
     */
    readonly url: string_url | null;

    /**
     * Mime type of the source
     */
    readonly mimeType: string_mime_type;

    /**
     * Get the content as parsed JSON
     */
    asJson(): Promisable<unknown>;

    /**
     * Get the content as a utf-8 string
     */
    asText(): Promisable<string>;
};

/**
 * TODO: [🧠] Maybe split `ScraperSourceHandler` into `ScraperWebsiteSourceHandler` + `ScraperFileSourceHandler`
 * TODO: [🥽] Add ` asBlob(): Promisable<Blob>;` or asFile
 * TODO: [🔼] Export via types
 */
