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

    // Replace useSubject
    if (content.includes('useSubject')) {
        content = content.replace(/import\s+\{.*useSubject.*\}\s+from\s+['"](?:\.\.\/)+contexts\/SubjectContext['"];?/g, "import { useSubjectStore } from '$1stores/useSubjectStore';");
        content = content.replace(/import\s+\{.*useSubject.*\}\s+from\s+['"](?:\.\/)+contexts\/SubjectContext['"];?/g, "import { useSubjectStore } from '$1stores/useSubjectStore';");
        
        // Simpler import replacements for different relative paths
        content = content.replace(/import \{([^}]*)useSubject([^}]*)\} from '(\.\.\/)*contexts\/SubjectContext';/g, "import { useSubjectStore } from '$3stores/useSubjectStore';");
        content = content.replace(/import \{([^}]*)useSubject([^}]*)\} from '(\.\.\/)*\.\.\/contexts\/SubjectContext';/g, "import { useSubjectStore } from '$3../stores/useSubjectStore';");
        
        // Very lazy regex for any context import path, works if they are well formatted
        content = content.replace(/import\s+\{\s*useSubject\s*\}\s+from\s+['"]([^'"]+)contexts\/SubjectContext['"];/g, "import { useSubjectStore } from '$1stores/useSubjectStore';");

        // We also need to change the function call: const { subject, ... } = useSubject(); -> const { subject, ... } = useSubjectStore();
        content = content.replace(/useSubject\(\)/g, "useSubjectStore()");
        changed = true;
    }

    // Replace useSettings
    if (content.includes('useSettings')) {
        content = content.replace(/import\s+\{\s*useSettings\s*\}\s+from\s+['"]([^'"]+)contexts\/SettingsContext['"];/g, "import { useSettingsStore } from '$1stores/useSettingsStore';");
        content = content.replace(/useSettings\(\)/g, "useSettingsStore()");
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
    }
});
