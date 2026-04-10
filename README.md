# Apunts PRO2 / M1 / M2

Plataforma per compartir apunts interactius, solucionaris del Jutge.org i recursos acadèmics per a les assignatures de **Programació 2 (PRO2)** i **Matemàtiques (M1/M2)** a la UPC-FIB.

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

## Stack tecnològic

- **Core:** React 19, TypeScript, Vite, PWA
- **Estils & UI:** Tailwind CSS v4, Framer Motion, Lucide React, React Three Fiber (Three JS)
- **Rutes & estats:** React Router v7, Context API nativa
- **Backend & dades:** Firebase (Auth, Firestore)
- **Gestió de contingut (Markdown):** `@content-collections` (amb Zod), React Markdown, Unifiedjs (Remark/Rehype), KaTeX, PrismJS / CodeMirror
- **Serveis externs:** Vercel Serverless Functions (Proxy de Jutge.org per *scraping*)

## Estructura (`src/`)

- `components/`: UI encapsulada, destaquen simuladors integrables al MD (`OOPPlayer`, `AlgoPlayer`, `GraphVisualizer`).
- `content/`: Base de dades estàtica en format Markdown (`/notes/pro2/`, `/notes/m1/`). Compilat estretament per *Content Collections*.
- `contexts/`: Estats globals (Auth, Subject).
- `lib/`: Connexions a serveis i lògica pura (`firebase.ts`, simulacions).
- `markdown/`: Eina de renderitzat avançat (Custom directives al Markdown).
- `pages/`: Vistes assignades al Router.

## Instal·lació i desenvolupament

1. **Clonar el repositori**
   ```bash
   git clone https://github.com/CreatorSaWiX/apunts-pro2.git
   ```

2. **Instal·lar dependències**
   ```bash
   npm install
   ```

3. **Configuració** (Opcional)
   Crea un fitxer `.env.local` amb la teva configuració de Firebase i credencials opcionals del Jutge.

4. **Executar en local**
   ```bash
   npm run dev
   ```

## Contribucions

Som una comunitat oberta! Si vols afegir apunts o millorar la plataforma:
1. Revisa que l'aplicació compili correctament (`npm run build`).
2. Segueix els estàndards de TypeScript (no `any`).
3. Obre una Pull Request amb una descripció clara del canvi.

---
**Llicència:** MIT | Mantingut per [@CreatorSaWiX](https://github.com/CreatorSaWiX)
