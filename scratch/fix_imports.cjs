const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Fix $1 literal string which resulted from bad regex
    if (content.includes("'$1stores/useSubjectStore'")) {
        const depth = file.split(path.sep).length - 2;
        const prefix = depth === 0 ? './' : '../'.repeat(depth);
        content = content.replace(/'\$1stores\/useSubjectStore'/g, `'${prefix}stores/useSubjectStore'`);
        changed = true;
    }

    if (content.includes("'$1stores/useSettingsStore'")) {
        const depth = file.split(path.sep).length - 2;
        const prefix = depth === 0 ? './' : '../'.repeat(depth);
        content = content.replace(/'\$1stores\/useSettingsStore'/g, `'${prefix}stores/useSettingsStore'`);
        changed = true;
    }

    if (file.includes('PlannerSection.tsx')) {
        if (content.includes('useSettings()')) {
            content = content.replace(/useSettings\(\)/g, "useSettingsStore()");
            changed = true;
        }
        if (content.includes('import { useSettingsStore } from ') === false) {
           content = content.replace(/import\s+\{.*useSettings.*\}\s+from\s+['"].*['"];?/, "import { useSettingsStore } from '../../stores/useSettingsStore';");
           changed = true;
        }
    }

    if (file.includes('TasksContext.tsx') || file.includes('SubjectContext.tsx')) {
        if (content.includes('useSettings()')) {
            content = content.replace(/useSettings\(\)/g, "useSettingsStore()");
            changed = true;
        }
        if (content.includes('import { useSettingsStore } from ') === false) {
           content = content.replace(/import\s+\{.*useSettings.*\}\s+from\s+['"].*['"];?/, "import { useSettingsStore } from '../stores/useSettingsStore';");
           changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed imports in', file);
    }
});
