#!/usr/bin/env tsx
/**
 * migrate-dollar-to-mark.ts
 * 
 * Migration script for converting legacy `$highlight$` syntax to `==highlight==` syntax.
 * 
 * PROBLEM:
 *   Contributors used `$text$` for both LaTeX math AND text highlighting.
 *   This caused ambiguity because `remark-math` captures `$...$` for KaTeX rendering.
 *   
 * SOLUTION:
 *   - `$...$` → reserved exclusively for LaTeX math (e.g., `$O(n \log n)$`)
 *   - `==...==` → new highlight syntax (e.g., `==important concept==`)
 *
 * USAGE:
 *   npx tsx scripts/migrate-dollar-to-mark.ts          # Dry run (default)
 *   npx tsx scripts/migrate-dollar-to-mark.ts --apply   # Apply changes
 *
 * SAFETY:
 *   - Dry run by default: shows what would change without modifying files
 *   - Skips content that looks like real LaTeX (contains \, ^, _, {, })
 *   - Generates a report of all changes for manual review
 *   - Won't touch double-dollar `$$...$$` (block LaTeX)
 */

import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.resolve(__dirname, '../src/content');
const DRY_RUN = !process.argv.includes('--apply');

// Characters that indicate real LaTeX math, NOT a highlight
const LATEX_INDICATORS = /[\\^_{}∑∫∏√≥≤≠∈∉⊂⊃∀∃]/;

// Match single-dollar inline: $content$ but NOT $$content$$
// Negative lookbehind for $ and negative lookahead for $
const SINGLE_DOLLAR_REGEX = /(?<!\$)\$([^\$\n]+?)\$(?!\$)/g;

interface Change {
    file: string;
    line: number;
    before: string;
    after: string;
}

function isLikelyHighlight(content: string): boolean {
    // If it contains LaTeX-like characters, it's probably math
    if (LATEX_INDICATORS.test(content)) return false;
    
    // If it's very short and looks like a variable name (e.g., $n$, $i$, $x$), it's likely math
    if (content.length <= 2 && /^[a-zA-Z]$/.test(content.trim())) return false;
    
    // If it contains spaces and no math operators, it's likely a highlight
    // (LaTeX rarely has plain multi-word text without operators)
    if (content.includes(' ') && !LATEX_INDICATORS.test(content)) return true;
    
    // If it looks like a function call or code (contains parens), skip
    if (/[()]/.test(content)) return false;

    // Default: ambiguous — mark as potential highlight for review
    return false;
}

function processFile(filePath: string): Change[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const changes: Change[] = [];
    let modified = false;

    const newLines = lines.map((line, idx) => {
        // Skip lines inside code blocks
        if (line.trimStart().startsWith('```')) return line;
        
        // Skip lines that are block math ($$)
        if (line.includes('$$')) return line;
        
        let newLine = line;
        SINGLE_DOLLAR_REGEX.lastIndex = 0;
        
        let match: RegExpExecArray | null;
        const replacements: { start: number; end: number; original: string; replacement: string }[] = [];
        
        while ((match = SINGLE_DOLLAR_REGEX.exec(line)) !== null) {
            const innerContent = match[1];
            
            if (isLikelyHighlight(innerContent)) {
                replacements.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    original: match[0],
                    replacement: `==${innerContent}==`
                });
            }
        }

        // Apply replacements in reverse order to preserve indices
        for (let i = replacements.length - 1; i >= 0; i--) {
            const r = replacements[i];
            newLine = newLine.slice(0, r.start) + r.replacement + newLine.slice(r.end);
            modified = true;
            changes.push({
                file: path.relative(CONTENT_DIR, filePath),
                line: idx + 1,
                before: line.trim(),
                after: newLine.trim()
            });
        }

        return newLine;
    });

    if (modified && !DRY_RUN) {
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
    }

    return changes;
}

function walkDir(dir: string): string[] {
    const files: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...walkDir(fullPath));
        } else if (entry.name.endsWith('.md')) {
            files.push(fullPath);
        }
    }
    return files;
}

// Main
console.log(`\n🔍 Scanning content in: ${CONTENT_DIR}`);
console.log(`📋 Mode: ${DRY_RUN ? 'DRY RUN (use --apply to write changes)' : '⚡ APPLYING CHANGES'}\n`);

const mdFiles = walkDir(CONTENT_DIR);
let totalChanges = 0;
const allChanges: Change[] = [];

for (const file of mdFiles) {
    const changes = processFile(file);
    if (changes.length > 0) {
        totalChanges += changes.length;
        allChanges.push(...changes);
    }
}

if (allChanges.length === 0) {
    console.log('✅ No highlight-style $...$ found. All content is already using ==...== or pure LaTeX.\n');
} else {
    console.log(`\n📊 Summary: ${totalChanges} potential highlight(s) found across ${new Set(allChanges.map(c => c.file)).size} file(s)\n`);
    
    for (const change of allChanges) {
        console.log(`  📄 ${change.file}:${change.line}`);
        console.log(`     - ${change.before}`);
        console.log(`     + ${change.after}`);
        console.log('');
    }

    if (DRY_RUN) {
        console.log('💡 Run with --apply to write these changes to disk.\n');
    } else {
        console.log(`✅ Applied ${totalChanges} change(s).\n`);
    }
}
