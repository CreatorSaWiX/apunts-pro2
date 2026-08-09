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
        // Calculate relative path to src/stores based on file depth
        const depth = file.split(path.sep).length - 2; // src/ is 1, so src/components/Hero.tsx is depth 1
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

    // Fix useSettingsStore instead of useSettings in contexts that were not updated properly
    if (content.includes("Cannot find name 'useSettingsStore'")) { // not a code string, just need to fix specific files
        // I will fix PlannerSection, SubjectContext and TasksContext below.
    }
    
    // Quick fixes for known files based on TSC output
    if (file.includes('PlannerSection.tsx')) {
        content = content.replace(/useSettings\(\)/g, "useSettingsStore()");
        if (!content.includes('useSettingsStore') || content.includes('useSettingsStore()') && !content.includes('import { useSettingsStore')) {
           content = content.replace(/import\s+\{.*useSettings.*\}\s+from\s+['"].*['"];?/, "import { useSettingsStore } from '../../stores/useSettingsStore';");
        }
        changed = true;
    }

    if (file.includes('TasksContext.tsx')) {
        content = content.replace(/useSettings\(\)/g, "useSettingsStore()");
        if (!content.includes('import { useSettingsStore')) {
           content = content.replace(/import\s+\{.*useSettings.*\}\s+from\s+['"].*['"];?/, "import { useSettingsStore } from '../stores/useSettingsStore';");
        }
        changed = true;
    }
    
    if (file.includes('SubjectContext.tsx')) {
        content = content.replace(/useSettings\(\)/g, "useSettingsStore()");
        if (!content.includes('import { useSettingsStore')) {
           content = content.replace(/import\s+\{.*useSettings.*\}\s+from\s+['"].*['"];?/, "import { useSettingsStore } from '../stores/useSettingsStore';");
        }
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed imports in', file);
    }
});
