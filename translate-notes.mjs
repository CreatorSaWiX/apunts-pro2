import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function translateText(text, targetLang) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  
  const systemInstruction = `You are a technical translator. Translate the given Markdown file into ${targetLang}. 
Rules:
1. Preserve all markdown formatting, HTML tags, frontmatter (YAML), and LaTeX formulas exactly as they are.
2. Only translate the textual content (paragraphs, headings, frontmatter title/description). 
3. DO NOT translate code blocks, mathematical formulas, or file paths/URLs.
4. Output ONLY the translated markdown content. No explanations, no markdown code block wrappers (do not wrap in \`\`\`markdown).`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: text }]
      }
    ],
    systemInstruction: {
      role: "system",
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.1
    }
  };

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 429) {
          console.warn('Rate limited, waiting 10s...');
          await sleep(10000);
          retries--;
          continue;
        }
        throw new Error(JSON.stringify(data));
      }
      
      let translated = data.candidates[0].content.parts[0].text;
      
      // Clean up markdown block wrapping if it accidentally added it
      if (translated.startsWith('```markdown\n')) {
          translated = translated.replace(/^```markdown\n/, '');
          if (translated.endsWith('\n```')) {
              translated = translated.slice(0, -4);
          }
      }
      
      return translated;
    } catch (e) {
      console.error('Error during translation:', e.message);
      retries--;
      await sleep(2000);
    }
  }
  throw new Error('Failed to translate after 3 retries');
}

async function main() {
  const files = globSync('src/content/notes/*/ca/*.md');
  console.log(`Found ${files.length} files to translate.`);

  const languages = [
    { code: 'es', name: 'Spanish' },
    { code: 'en', name: 'English' }
  ];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const dirname = path.dirname(file); // e.g., src/content/notes/m1/ca
    const filename = path.basename(file);
    const subjectDir = path.dirname(dirname); // e.g., src/content/notes/m1

    for (const lang of languages) {
      const targetDir = path.join(subjectDir, lang.code);
      const targetFile = path.join(targetDir, filename);

      if (fs.existsSync(targetFile)) {
        console.log(`Skipping ${targetFile} (already exists)`);
        continue;
      }

      console.log(`Translating ${filename} to ${lang.code}...`);
      try {
        const translated = await translateText(content, lang.name);
        
        fs.mkdirSync(targetDir, { recursive: true });
        fs.writeFileSync(targetFile, translated);
        console.log(`Saved ${targetFile}`);
        
        // Wait briefly to avoid hitting rate limits too fast (15 RPM for free tier usually, but lets assume we have some limit)
        await sleep(1500);
      } catch (err) {
        console.error(`Failed on ${file} -> ${lang.code}`, err);
      }
    }
  }
}

main();
