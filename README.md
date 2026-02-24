# Apunts PRO2 & M1

Plataforma interactiva (SPA) per a estudiants de la FIB-UPC dissenyada per compartir apunts, solucionaris i recursos d'assignatures com Programació 2 (PRO2) i Matemàtiques 1 (M1).

[![M1 PRO2 Stack](https://img.shields.io/badge/Stack-React_19_|_Vite_|_Tailwind_v4_|_Firebase-000?style=for-the-badge&logo=react)](https://reactjs.org/)

## Stack Tecnològic

- **Core:** React 19, TypeScript, Vite, PWA
- **Estils & UI:** Tailwind CSS v4, Framer Motion, Lucide React
- **Rutes & Estats:** React Router v7, Context API nativa
- **Backend & Dades:** Firebase (Auth, Firestore, Storage)
- **Gestió de Contingut (Markdown):** `@content-collections` (amb Zod), React Markdown, Unifiedjs (Remark/Rehype), KaTeX, PrismJS / CodeMirror
- **Serveis Externs:** Vercel Serverless Functions (Proxy de Jutge.org per *scraping*)

## Estructura Principal (`src/`)

- `components/`: UI encapsulada, destaquen simuladors integrables al MD (`OOPPlayer`, `AlgoPlayer`, `GraphVisualizer`).
- `content/`: Base de dades estàtica en format Markdown (`/notes/pro2/`, `/notes/m1/`). Compilat estretament per *Content Collections*.
- `contexts/`: Estats globals (Auth, Subject).
- `lib/`: Connexions a serveis i lògica pura (`firebase.ts`, simulacions).
- `markdown/`: Eina de renderitzat avançat (Custom directives al Markdown).
- `pages/`: Vistes assignades al Router.

## Instal·lació i Desenvolupament

1. **Clonar i instal·lar**
   ```bash
   git clone https://github.com/CreatorSaWiX/apunts.git
   cd apunts
   npm install
   ```

2. **Variables d'Entorn**
   Crea un fitxer `.env` (o `.env.local`):
   ```env
   # Firebase Config (Necessari per registre/fòrum)
   VITE_FIREBASE_API_KEY="..."
   VITE_FIREBASE_AUTH_DOMAIN="..."
   VITE_FIREBASE_PROJECT_ID="..."
   VITE_FIREBASE_STORAGE_BUCKET="..."
   VITE_FIREBASE_MESSAGING_SENDER_ID="..."
   VITE_FIREBASE_APP_ID="..."

   # Jutge Proxy (Opcional)
   JUTGE_EMAIL="..."
   JUTGE_PASSWORD="..."
   ```

3. **Inici Local**
   ```bash
   npm run dev
   ```

## Contribucions

Oberts a PRs per afegir apunts o millorar codi:
1. Revisa que l'aplicació compila (`npm run build`).
2. Fes servir TypeScript estricte (evita `any`).
3. Utilitza la convenció de commits (`feat:`, `fix:`, `docs:`).
4. Obre la PR al repositori principal.

---
**Llicència:** MIT | Mantingut per [@CreatorSaWiX](https://github.com/CreatorSaWiX)
