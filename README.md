# Apunts PRO2 / M1 / M2

Platform to share interactive notes, problem solutions from Jutge.org, and academic resources for **Programming 2 (PRO2)** and **Mathematics (M1/M2)** at UPC-FIB.

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

## Tech stack

- **Core:** React 19, TypeScript, Vite, PWA
- **Styles & UI:** Tailwind CSS v4, Framer Motion, Lucide React, React Three Fiber (Three JS)
- **Routes & states:** React Router v7, Context API nativa
- **Backend & data:** Firebase (Auth, Firestore)
- **Content management (Markdown):** `@content-collections` (with Zod), React Markdown, Unifiedjs (Remark/Rehype), KaTeX, PrismJS / CodeMirror
- **External services:** Vercel Serverless Functions (Proxy for Jutge.org for *scraping*)

## Structure (`src/`)

- `components/`: Encapsulated UI, featuring simulators integrable in MD (`OOPPlayer`, `AlgoPlayer`, `GraphVisualizer`).
- `content/`: Static database in Markdown format (`/notes/pro2/`, `/notes/m1/`). Closely compiled by *Content Collections*.
- `contexts/`: Global states (Auth, Subject).
- `lib/`: Connections to services and pure logic (`firebase.ts`, simulations).
- `markdown/`: Advanced rendering tool (Custom directives in Markdown).
- `pages/`: Views assigned to the Router.

## Installation and development

1. **Clone the repository**
   ```bash
   git clone https://github.com/CreatorSaWiX/apunts-pro2.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configuration** (Optional)
   Create a `.env.local` file with your Firebase configuration and optional Jutge credentials.

4. **Run in local**
   ```bash
   npm run dev
   ```

## Contributing

We are an open community! If you want to add notes or improve the platform:
1. Check that the application compiles correctly (`npm run build`).
2. Follow strict TypeScript standards (avoid `any`).
3. Open a Pull Request with a clear description of the change.

---
**License:** MIT | Maintained by [@CreatorSaWiX](https://github.com/CreatorSaWiX)
