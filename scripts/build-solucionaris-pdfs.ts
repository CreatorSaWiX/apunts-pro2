import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import os from 'os';

// Import our data structures (using .ts files directly with tsx)
import { allSolutions } from '../src/content/data/solutions';
import { courseStructure } from '../src/content/data/courseStructure';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_PDFS_DIR = path.resolve(__dirname, '../public/pdfs/solucionaris');

/**
 * Neteja les directives purament web (MDX) i estandarditza el LaTeX
 * per evitar que Pandoc/XeLaTeX esclatin.
 */
function preprocessMarkdownForPDF(content: string) {
    let md = content;

    // 1. FASE DE PROTECCIÓ: Extreure tot el contingut matemàtic a placeholders
    const mathBlocks: string[] = [];
    
    // Extreure display math $$ ... $$
    md = md.replace(/\$\$([\s\S]+?)\$\$/g, (match) => {
        const placeholder = `__MATH_BLOCK_${mathBlocks.length}__`;
        mathBlocks.push(match);
        return `\n\n${placeholder}\n\n`;
    });
    
    // Extreure inline math $ ... $
    md = md.replace(/(?<!\\)\$([^$]+?)\$/g, (match) => {
        const placeholder = `__MATH_BLOCK_${mathBlocks.length}__`;
        mathBlocks.push(match);
        return ` ${placeholder} `;
    });

    // 2. FASE DE NETEJA: Processar el text Markdown restant
    md = md.replace(/:::graph[\s\S]*?:::/g, '\n*[Gràfic interactiu disponible a la versió web]*\n');
    md = md.replace(/:::(?:algoviz|oopviz)[\s\S]*?:::/g, '\n*[Simulació interactiva disponible a la web]*\n');
    md = md.replace(/::videoviz\{.*?\}/g, '\n*[Vídeo disponible a la web]*\n');
    md = md.replace(/::mafs\{.*?\}/g, '\n*[Gràfic interactiu disponible a la web]*\n');

    md = md.replace(/:::tip(?:\{title="(.*?)"\})?([\s\S]*?):::/g, (match, title, body) => {
        const t = title ? `**${title}**` : `**Nota Principal**`;
        return `\n> ${t}\n>\n${body.trim().split('\n').map(l => `> ${l}`).join('\n')}\n`;
    });

    md = md.replace(/::::?grid.*?\n/g, '\n');
    md = md.replace(/::::?\n/g, '\n');
    md = md.replace(/:::?graph.*?\n/g, '\n');
    md = md.replace(/:::?\n/g, '\n');
    md = md.replace(/::(?:three|proofviz|two|one|videoviz|mafs).*?\n/g, '\n');
    
    md = md.replace(/<details>\s*<summary>(.*?)<\/summary>/g, '\n**$1**\n');
    md = md.replace(/<\/details>/g, '\n');

    // 3. FASE DE RESTAURACIÓ: Tornar a posar el LaTeX netejat
    mathBlocks.forEach((block, i) => {
        const placeholder = `__MATH_BLOCK_${i}__`;
        let inner = block.startsWith('$$') ? block.slice(2, -2) : block.slice(1, -1);
        inner = inner.trim();
        
        // FIXES ESPECÍFICS PER A CRASHES DE LATEX:
        
        // a) Strip \mathbf només si embolcalla un entorn \begin (matrius). 
        // No usem regex per a \mathbf genèrics perquè el tancament de claus } és ambigu per a regex (no recursiu).
        inner = inner.replace(/\\mathbf\{(\\begin\{[\s\S]*?\\end\{[\s\S]*?\})\}/g, '$1');
        
        // b) Fix Subscripts: _\mathcal{B} -> _{\mathcal{B}}
        // LaTeX requereix claus si el subíndex és una comanda complexa.
        inner = inner.replace(/_\\([a-zA-Z]+)\{([^}]+)\}/g, '_{\\$1{$2}}');
        inner = inner.replace(/_\\([a-zA-Z]+)(?![a-zA-Z{])/g, '_{\\$1}');

        const restored = block.startsWith('$$') ? `$$\n${inner}\n$$` : `$${inner}$`;
        md = md.split(placeholder).join(restored);
    });

    // 4. Mapeig final de caràcters Unicode problemàtics
    const charMap: Record<string, string> = {
        '✅': '[OK]', '❌': '[X]', '✗': '[X]', '✓': '[OK]',
        '𝜆': '$\\lambda$', '𝛼': '$\\alpha$', '𝛽': '$\\beta$', '𝜋': '$\\pi$',
        '≥': '$\\geq$', '≤': '$\\leq$',
        'ₖ': '$_{k}$', '₁': '$_{1}$', '₂': '$_{2}$', '₃': '$_{3}$', '₄': '$_{4}$', '₅': '$_{5}$',
        '⁶': '$^{6}$', '⁷': '$^{7}$', '⁸': '$^{8}$', '⁹': '$^{9}$', '⁰': '$^{0}$',
    };

    for (const [char, replacement] of Object.entries(charMap)) {
        md = md.split(char).join(replacement);
    }

    return md;
}

async function generateSolucionarisPDFs() {
    console.log('🚀 Iniciant generació de PDFs dels solucionaris...');

    if (!fs.existsSync(PUBLIC_PDFS_DIR)) {
        fs.mkdirSync(PUBLIC_PDFS_DIR, { recursive: true });
    }

    for (const topicSolutions of allSolutions) {
        const { topicId, solutions } = topicSolutions;
        const topicDef = courseStructure.find(t => t.id === topicId);
        
        if (!topicDef || solutions.length === 0) continue;

        const subject = topicId.split('-')[0];
        const lang = 'ca'; 
        const outputDir = path.join(PUBLIC_PDFS_DIR, subject, lang);
        
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        const pdfPath = path.join(outputDir, `solucionari-${topicId}.pdf`);
        console.log(`\n📄 Generant PDF per a: ${topicId} (${solutions.length} exercicis)...`);

        let mdContent = `---\ntitle: "Solucionari: ${topicDef.title}"\nauthor: "Apunts"\n---\n\n`;
        mdContent += `# Solucionari: ${topicDef.title}\n\n`;
        if (topicDef.description) mdContent += `*${topicDef.description}*\n\n---\n\n`;

        for (const sol of solutions) {
            mdContent += `## ${sol.title}\n\n`;
            if (sol.statement) mdContent += `### Enunciat\n\n${sol.statement}\n\n`;
            mdContent += `### Solució\n\n`;
            if (sol.content) {
                mdContent += `${sol.content}\n\n`;
            } else if (sol.code) {
                const codeLang = subject === 'pro2' ? 'cpp' : '';
                mdContent += `\`\`\`${codeLang}\n${sol.code}\n\`\`\`\n\n`;
            }
            mdContent += `---\n\n`;
        }

        const cleanedContent = preprocessMarkdownForPDF(mdContent);
        const tempMdPath = path.join(os.tmpdir(), `temp_sol_${topicId}_${Date.now()}.md`);
        fs.writeFileSync(tempMdPath, cleanedContent, 'utf8');

        try {
            const command = `pandoc "${tempMdPath}" -o "${pdfPath}" --pdf-engine=xelatex -V geometry:margin=2.5cm --toc`;
            execSync(command, { stdio: 'inherit' });
            console.log(`✅ PDF generat: ${pdfPath}`);
        } catch (e: any) {
            console.error(`❌ Error generant PDF per a ${topicId}:`, e.message);
            const debugPath = path.join(process.cwd(), `debug_${topicId}.md`);
            fs.writeFileSync(debugPath, cleanedContent, 'utf8');
            console.log(`🔍 Markdown de depuració desat a: ${debugPath}`);
        } finally {
            if (fs.existsSync(tempMdPath)) fs.unlinkSync(tempMdPath);
        }
    }
    console.log('\n🎉 Finalitzada la generació de PDFs dels solucionaris!');
}

generateSolucionarisPDFs().catch(console.error);
