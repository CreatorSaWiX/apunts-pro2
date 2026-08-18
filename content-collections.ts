import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

const personalNotes = defineCollection({
    name: "personalNotes",
    directory: "src/content/notes",
    include: "**/*.md",
    schema: z.object({
        title: z.string(),
        description: z.string(),
        readTime: z.string().optional(),
        order: z.number(),
        draft: z.boolean().optional().default(false),
        isNew: z.boolean().optional().default(false),
        isUpdated: z.number().optional(),
        content: z.string()
    }),
    transform: (document) => {
        const dPath = document._meta.directory || "";
        
        // La ruta sempre és "assignatura/idioma" (ex. "m1/ca" o "pro2/es")
        const parts = dPath.split(/[/\\]/);
        
        const subject = parts[0]?.toLowerCase() || 'pro2';
        const lang = parts[1]?.toLowerCase() || 'ca';

        return {
            ...document,
            subject,
            lang,
            slug: `${subject}-${document._meta.fileName.replace(/\.md$/, '')}`
        };
    }
});

export default defineConfig({
    collections: [personalNotes],
});
