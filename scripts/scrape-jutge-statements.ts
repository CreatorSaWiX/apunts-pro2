/**
 * scrape-jutge-statements.ts
 *
 * CLI runner for synchronizing Jutge statements.
 * Usage:
 *   npm run scrape-jutge         # Syncs only missing problem IDs (fast, 0ms if already cached)
 *   npm run scrape-jutge:force   # Re-scrapes all statements from scratch
 */

import { syncJutgeStatements } from './jutge-sync.ts';

const force = process.argv.includes('--force');

syncJutgeStatements({ force, silent: false }).catch(err => {
    console.error('[jutge-sync] Error durant la sincronització:', err);
    process.exit(1);
});
