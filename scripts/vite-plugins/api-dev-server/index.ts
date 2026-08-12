import { loadEnv, type Plugin } from 'vite';
import { jutgeProxyController } from './controllers/jutge-proxy';
import { resetPasswordController } from './controllers/reset-password';
import { generateQuizController } from './controllers/generate-quiz';
import { chatController } from './controllers/chat';
import { plannerAiController } from './controllers/planner-ai';
import { roadmapAiController } from './controllers/roadmap-ai';
import { r2PresignController, r2CdnController } from './controllers/r2';

export function apiDevServerPlugin(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    name: 'jutge-api-dev-server',
    configureServer(server) {
      server.middlewares.use('/api/jutge-proxy', (req, res) => jutgeProxyController(req, res, env));
      server.middlewares.use('/api/reset-password', (req, res) => resetPasswordController(req, res, env));
      server.middlewares.use('/api/generate-quiz', (req, res) => generateQuizController(req, res, env));
      server.middlewares.use('/api/chat', (req, res) => chatController(req, res, env));
      server.middlewares.use('/api/planner-ai', (req, res) => plannerAiController(req, res, env));
      server.middlewares.use('/api/roadmap-ai', (req, res) => roadmapAiController(req, res, env));
      server.middlewares.use('/api/r2-presign', (req, res) => r2PresignController(req, res, env));
      server.middlewares.use('/api/cdn', (req, res) => r2CdnController(req, res, env));
    }
  };
}
