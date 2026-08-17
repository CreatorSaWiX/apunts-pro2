import { z } from "zod";

// --- Chat Schemas ---
export const chatMessageSchema = z.object({
  role: z.enum(["user", "model", "system"]),
  content: z.string(),
});

export const chatRequestSchema = z.object({
  message: z.string().min(1, "El missatge no pot estar buit"),
  history: z.array(chatMessageSchema).optional().default([]),
  currentPath: z.string().optional().default("/"),
  pageText: z.string().optional().default(""),
  image: z
    .object({
      data: z.string(),
      mimeType: z.string(),
    })
    .optional(),
  aiSettings: z.any().optional(), // També es pot tipar de forma més estricta si cal
});

// --- Roadmap Schemas ---
export const roadmapRequestSchema = z.object({
  prompt: z.string().optional(),
  currentNodes: z.array(z.any()).optional().default([]),
  history: z.array(chatMessageSchema).optional().default([]),
  memory: z.any().optional(),
  aiSettings: z.any().optional(),
  userName: z.string().optional(),
  attachedFile: z
    .object({
      data: z.string(),
      mimeType: z.string(),
    })
    .optional(),
});

// --- Quiz Schemas ---
export const quizRequestSchema = z.object({
  topicId: z.string().min(1),
  markdownContent: z.string().min(1),
});

// --- Planner Schemas ---
export const plannerRequestSchema = z.object({
  prompt: z.string().optional(),
  currentTasks: z.array(z.any()).optional().default([]),
  subjects: z.array(z.any()).optional().default([]),
  currentDate: z.string().optional(),
  aiSettings: z.any().optional(),
  attachedFile: z
    .object({
      data: z.string(),
      mimeType: z.string(),
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
