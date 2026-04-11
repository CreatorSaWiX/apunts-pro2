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
        content: z.string()
    }),
    transform: (document) => {
        // Separem "m1/ca" -> ["m1", "ca"] (compatibilitat Windows i Mac)
        const pathParts = document._meta.directory.split(/[\\/]/);
        const subject = pathParts[0] || 'pro2';
        const lang = pathParts[1] || 'ca'; // 'ca' per defecte per precaució

        return {
            ...document,
            subject: subject,
            lang: lang,
            // El slug es queda igual ("m1-tema-1") per no trencar les URLs
            slug: `${subject}-${document._meta.fileName.replace(/\.md$/, '')}`
        };
    }
});

export default defineConfig({
    collections: [personalNotes],
});
