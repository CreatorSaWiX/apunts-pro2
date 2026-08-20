import { z } from "zod";

// --- AI Settings Schema ---
export const aiSettingsSchema = z.object({
  identity: z.object({
    name: z.string().max(60).optional(),
    pronouns: z.string().max(30).optional(),
    vibe: z.string().max(300).optional(),
    avatarUrl: z.string().max(1000).optional(),
  }).optional(),
  soul: z.object({
    rules: z.string().max(2000).optional(),
    boundaries: z.string().max(2000).optional(),
    continuity: z.string().max(2000).optional(),
    customDirectives: z.string().max(2000).optional(),
  }).optional(),
  userContext: z.object({
    userPreferredName: z.string().max(60).optional(),
    memories: z.array(z.string().max(300)).max(50).optional(),
  }).optional(),
}).optional();

// --- Chat Schemas ---
export const chatMessageSchema = z.object({
  role: z.enum(["user", "model", "system"]),
  content: z.string().max(10000),
});

export const chatRequestSchema = z.object({
  message: z.string().min(1, "El missatge no pot estar buit").max(5000),
  history: z.array(chatMessageSchema).max(30).optional().default([]),
  currentPath: z.string().max(500).optional().default("/"),
  pageText: z.string().max(6000).optional().default(""),
  image: z
    .object({
      data: z.string().max(7_000_000), // ~5MB base64
      mimeType: z.string().max(100),
    })
    .optional(),
  aiSettings: aiSettingsSchema,
});

// --- Roadmap Schemas ---
export const roadmapRequestSchema = z.object({
  prompt: z.string().max(5000).optional(),
  currentNodes: z.array(z.any()).max(100).optional().default([]),
  history: z.array(chatMessageSchema).max(30).optional().default([]),
  memory: z.any().optional(),
  aiSettings: aiSettingsSchema,
  userName: z.string().max(100).optional(),
  attachedFile: z
    .object({
      data: z.string().max(7_000_000),
      mimeType: z.string().max(100),
    })
    .optional(),
});

// --- Quiz Schemas ---
export const quizRequestSchema = z.object({
  topicId: z.string().min(1).max(200),
  markdownContent: z.string().min(1).max(100000),
});

// --- Planner Schemas ---
export const plannerRequestSchema = z.object({
  prompt: z.string().max(5000).optional(),
  currentTasks: z.array(z.any()).max(500).optional().default([]),
  subjects: z.array(z.any()).max(100).optional().default([]),
  currentDate: z.string().max(100).optional(),
  aiSettings: aiSettingsSchema,
  attachedFile: z
    .object({
      data: z.string().max(7_000_000),
      mimeType: z.string().max(100),
    })
    .optional(),
});

// --- Algolia Sync Schemas ---
export const algoliaSyncRequestSchema = z.object({
  action: z.enum(["create", "update", "delete"]),
  post: z.any().optional(), // Pot ser un objecte per crear/update
  postId: z.string().optional(), // Necesari per delete
});

// --- R2 Presign Schemas ---
export const r2PresignRequestSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
});

// --- Reset Password Schemas ---
export const resetPasswordRequestSchema = z.object({
  email: z.email(),
  lang: z.enum(["ca", "es", "en"]).optional().default("ca"),
});
