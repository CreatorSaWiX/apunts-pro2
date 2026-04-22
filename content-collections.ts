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
        // Mètode a prova de bales per Windows/Mac: analitzem l'string sencer de la ruta
        const dPath = (document._meta.directory || "").toLowerCase();
        
        let subject = 'pro2';
        if (dPath.includes('m1')) subject = 'm1';
        if (dPath.includes('m2')) subject = 'm2';
        
        let lang = 'ca';
        // Busquem rutes tipus /es o \es o /es/ 
        if (dPath.includes('/es') || dPath.includes('\\es') || dPath === 'es') {
            lang = 'es';
        }

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
