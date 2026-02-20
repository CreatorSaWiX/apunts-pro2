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
        content: z.string()
    }),
    transform: (document) => {
        const subject = document._meta.directory; // "pro2" or "m1"
        return {
            ...document,
            subject: subject || 'pro2',
            slug: `${subject || 'pro2'}-${document._meta.fileName.replace(/\.md$/, '')}`
        };
    }
});

export default defineConfig({
    collections: [personalNotes],
});
