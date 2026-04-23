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
 * Neteja les directives purament web (MDX) perquè el motor LaTeX de Pandoc
 * no injecti el JSON ni caixes trencades en el PDF imprès. 
 */
function preprocessMarkdownForPDF(content: string) {
    let md = content;

    // 1. Eliminar blocs de grafs amb JSON pur
    md = md.replace(/:::graph[\s\S]*?:::/g, '\n*[Gràfic interactiu disponible a la versió web de l\'apunt]*\n');

    // 2. Eliminar altres widgets amb body (Algos, OOP, etc.)
    md = md.replace(/:::(?:algoviz|oopviz)[\s\S]*?:::/g, '\n*[Simulació interactiva disponible a la web]*\n');

    // 3. Eliminar ginys visuals d'una línia (Mafs, Vídeos)
    md = md.replace(/::videoviz\{.*?\}/g, '\n*[Vídeo interactiu disponible a la versió web]*\n');
    md = md.replace(/::mafs\{.*?\}/g, '\n*[Gràfic matemàtic interactiu disponible a la versió web]*\n');

    // 4. Transformar caixes "TIP" amb fons
    md = md.replace(/:::tip(?:\{title="(.*?)"\})?([\s\S]*?):::/g, (match, title, body) => {
        const t = title ? `**${title}**` : `**Nota Principal**`;
        const lines = body.trim().split('\n').map(line => `> ${line}`);
        return `\n> ${t}\n>\n${lines.join('\n')}\n`;
    });

    // 5. Netejar divisòries i etiquetes inútils com ::::grid
    md = md.replace(/::::+grid.*?\n/g, '\n');
    md = md.replace(/::::+\n/g, '\n');
    
    // 6. Transformar <details> a text normal (perquè s'imprimeixi el codi desplegable!)
    md = md.replace(/<details>\s*<summary>(.*?)<\/summary>/g, '\n**$1**\n');
    md = md.replace(/<\/details>/g, '\n');

    // 7. Fix math delimiters: Pandoc is sensitive to spaces like "$ math $"
    // We only remove horizontal spaces immediately inside the dollars
    md = md.replace(/\$ +/g, '$');
    md = md.replace(/ +\$/g, '$');
    md = md.replace(/\$\$ +/g, '$$$$');
    md = md.replace(/ +\$\$/g, '$$$$');

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

        // Extract subject (m1, m2, pro2...)
        const subject = topicId.split('-')[0];
        
        // We assume Catalan for now as per current solutions.ts imports
        // But we could iterate over languages if solutions were structured differently
        const lang = 'ca'; 

        const outputDir = path.join(PUBLIC_PDFS_DIR, subject, lang);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const pdfPath = path.join(outputDir, `solucionari-${topicId}.pdf`);
        
        console.log(`\n📄 Generant PDF per a: ${topicId} (${solutions.length} exercicis)...`);

        // Create Markdown content
        let mdContent = `---\ntitle: "Solucionari: ${topicDef.title}"\nauthor: "Apunts"\n---\n\n`;
        mdContent += `# Solucionari: ${topicDef.title}\n\n`;
        
        if (topicDef.description) {
            mdContent += `*${topicDef.description}*\n\n---\n\n`;
        }

        for (const sol of solutions) {
            mdContent += `## ${sol.title}\n\n`;
            
            if (sol.statement) {
                mdContent += `### Enunciat\n\n${sol.statement}\n\n`;
            }

            mdContent += `### Solució\n\n`;
            if (sol.content) {
                mdContent += `${sol.content}\n\n`;
            } else if (sol.code) {
                // Detect language for code block if possible (simple heuristic)
                const codeLang = subject === 'pro2' ? 'cpp' : '';
                mdContent += `\`\`\`${codeLang}\n${sol.code}\n\`\`\`\n\n`;
            }

            mdContent += `---\n\n`;
        }

        // Clean content
        const cleanedContent = preprocessMarkdownForPDF(mdContent);

        // Temp file
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
            if (fs.existsSync(tempMdPath)) {
                fs.unlinkSync(tempMdPath);
            }
        }
    }

    console.log('\n🎉 Finalitzada la generació de PDFs dels solucionaris!');
}

generateSolucionarisPDFs().catch(console.error);
