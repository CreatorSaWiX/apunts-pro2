import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NOTES_DIR = path.resolve(__dirname, '../src/content/notes');
const PUBLIC_PDFS_DIR = path.resolve(__dirname, '../public/pdfs');

function findMarkdownFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findMarkdownFiles(filePath, fileList);
        } else if (filePath.endsWith('.md')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

/**
 * Neteja les directives purament web (MDX) perquè el motor LaTeX de Pandoc
 * no injecti el JSON ni caixes trencades en el PDF imprès. 
 */
function preprocessMarkdownForPDF(content) {
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

    return md;
}

console.log('Iniciant generació massiva de PDFs amb Preprocessament net...');
const mdFiles = findMarkdownFiles(NOTES_DIR);
console.log(`Trobats ${mdFiles.length} fitxers Markdown.\n`);

for (const mdPath of mdFiles) {
    const relativePath = path.relative(NOTES_DIR, mdPath);
    const pdfPath = path.join(PUBLIC_PDFS_DIR, relativePath.replace(/\.md$/, '.pdf'));
    const pdfDir = path.dirname(pdfPath);

    if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
    }

    // Llegim l'arxiu i el "netegem" de porqueria MDX
    const originalContent = fs.readFileSync(mdPath, 'utf8');
    const cleanedContent = preprocessMarkdownForPDF(originalContent);
    
    // El desem a un arxiu temporal per poder fer la crida a Pandoc
    const tempMdPath = path.join(os.tmpdir(), `temp_${Date.now()}.md`);
    fs.writeFileSync(tempMdPath, cleanedContent, 'utf8');

    console.log(`Compilant PDF net: ${relativePath} ...`);

    try {
        const command = `pandoc "${tempMdPath}" -o "${pdfPath}" --pdf-engine=xelatex -V geometry:margin=2.5cm`;
        execSync(command, { stdio: 'inherit' });
    } catch (e) {
        console.error(` ❌ Error processant ${relativePath}.`, e.message);
    } finally {
        // Esborrem l'arxiu temporal
        if (fs.existsSync(tempMdPath)) {
            fs.unlinkSync(tempMdPath);
        }
    }
}

console.log('\n🎉 Tots els PDFs s\'han generat correctament amb la neteja visual!');
