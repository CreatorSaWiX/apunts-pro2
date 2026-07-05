import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.resolve('public');
const MANIFEST_PATH = path.resolve('public/offline-manifest.json');
const SUBJECTS_PATH = path.resolve('src/data/subjects.json');

// Get all subjects
let subjects = [];
try {
    subjects = JSON.parse(fs.readFileSync(SUBJECTS_PATH, 'utf-8'));
} catch (e) {
    console.error("Failed to read subjects.json", e);
}

const directoriesToScan = ['pdfs', ...subjects.map(s => s.name.toLowerCase())];
const manifest = {};
directoriesToScan.forEach(dir => {
    manifest[dir] = [];
});

function scanDir(dirName, category) {
    const dirPath = path.join(PUBLIC_DIR, dirName);
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            scanDir(path.join(dirName, file.name), category);
        } else if (file.isFile() && !file.name.startsWith('.')) {
            // Store path relative to public directory with leading slash
            manifest[category].push(`/${dirName}/${file.name}`.replace(/\\/g, '/'));
        }
    }
}

directoriesToScan.forEach(dir => {
    scanDir(dir, dir);
});

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
console.log('✅ Generated public/offline-manifest.json');
