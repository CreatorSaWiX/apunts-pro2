# 📚 Apunts PRO2

> Una plataforma moderna i interactiva per compartir apunts, solucionaris i recursos del curs de **Programació 2** (PRO2) a la UPC.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

---

## ✨ Característiques

- 🎨 **Interfície moderna** amb animacions fluides (Framer Motion)
- 📝 **Editor de notes** en temps real amb suport Markdown
- 💻 **Solucionaris del Jutge** amb syntax highlighting (PrismJS)
- 🔐 **Autenticació segura** amb Firebase Authentication
- 🗂️ **Organització per temes** amb navegació intuïtiva
- 🌐 **Proxy del Jutge.org** per obtenir enunciats automàticament
- 📱 **Responsive design** optimitzat per a mòbil i desktop
- 🚀 **Deploy automàtic** a Vercel

---

## 🛠️ Stack Tecnològic

### Frontend
- **React 19** - Biblioteca UI amb les últimes millores de rendiment
- **TypeScript** - Tipat estàtic per a codi més robust
- **Vite** - Build tool ràpid i modern
- **TailwindCSS v4** - Framework CSS utility-first
- **Framer Motion** - Animacions i transicions fluides
- **React Router v7** - Routing del client

### Backend & Services
- **Firebase** - Autenticació i base de dades (Firestore)
- **Vercel Serverless Functions** - API proxy per Jutge.org
- **Cheerio** - Web scraping per obtenir enunciats

### Eines de Desenvolupament
- **ESLint** - Linter per mantenir codi consistent
- **PrismJS** - Syntax highlighting per a codi
- **Lucide React** - Icones modernes

---

## 🚀 Instal·lació i Configuració

### Prerequisits

- **Node.js** >= 18.0.0
- **npm** o **pnpm**
- Compte de **Firebase** (opcional, només per autenticació)

### Pas 1: Clonar el repositori

```bash
git clone https://github.com/CreatorSaWiX/apunts-pro2.git
cd apunts-pro2
```

### Pas 2: Instal·lar dependències

```bash
npm install
# o
pnpm install
```

### Pas 3: Configurar variables d'entorn

Crea un fitxer `.env` a l'arrel del projecte:

```env
# Credencials del Jutge.org (opcional, per obtenir enunciats)
JUTGE_EMAIL="el.teu.email@estudiantat.upc.edu"
JUTGE_PASSWORD="la_teva_contrasenya"
```

**⚠️ IMPORTANT:** El fitxer `.env` està protegit pel `.gitignore` i **mai** es pujarà a GitHub. No comparteixis les teves credencials!

### Pas 4: Configurar Firebase (opcional)

Si vols habilitar l'autenticació i base de dades:

1. Crea un projecte a [Firebase Console](https://console.firebase.google.com/)
2. Activa **Authentication** (Email/Password)
3. Crea una base de dades **Firestore**
4. Copia les credencials de configuració a `src/lib/firebase.ts`

### Pas 5: Executar en mode desenvolupament

```bash
npm run dev
```

L'aplicació estarà disponible a `http://localhost:5173` 🎉

---

## 🤝 Guia de Contribució

**Totes les contribucions són benvingudes!** 💪 Sigui que vulguis afegir nous apunts, millorar el codi, o reportar bugs, la teva ajuda és valuosa.

### Com contribuir

#### 1. **Fork del repositori**

Clica el botó "Fork" a la part superior dreta d'aquesta pàgina.

#### 2. **Clona el teu fork**

```bash
git clone https://github.com/EL-TEU-USUARI/apunts-pro2.git
cd apunts-pro2
```

#### 3. **Crea una nova branca**

Utilitza noms descriptius per a les teves branques:

```bash
# Per a noves funcionalitats
git checkout -b feature/nom-de-la-funcionalitat

# Per a correccions de bugs
git checkout -b fix/descripcio-del-bug

# Per a millores de documentació
git checkout -b docs/descripcio-millora
```

#### 4. **Fes els teus canvis**

- Segueix l'estil de codi existent
- Comenta el codi quan sigui necessari
- Assegura't que el codi compila sense errors (`npm run build`)
- Comprova el linter (`npm run lint`)

#### 5. **Commit dels canvis**

Utilitza missatges de commit descriptius:

```bash
git add .
git commit -m "feat: afegida secció de teoria sobre arbres binaris"
```

**Format recomanat de commits:**
- `feat:` - Nova funcionalitat
- `fix:` - Correcció de bug
- `docs:` - Canvis en documentació
- `style:` - Canvis de format (no afecten el codi)
- `refactor:` - Refactorització de codi
- `test:` - Afegir o modificar tests
- `chore:` - Tasques de manteniment

#### 6. **Push a la teva branca**

```bash
git push origin nom-de-la-teva-branca
```

#### 7. **Obre un Pull Request**

- Ves al repositori original a GitHub
- Clica "New Pull Request"
- Selecciona la teva branca
- Descriu els canvis que has fet
- Espera el review! 🎯

---

## 🏗️ Estructura del Projecte

```
apunts-pro2/
├── api/
│   └── jutge-proxy.ts          # Serverless function per obtenir enunciats
├── src/
│   ├── components/             # Components reutilitzables
│   │   ├── Hero.tsx
│   │   ├── Navigation.tsx
│   │   ├── TopicCarousel.tsx
│   │   └── ui/                 # Components UI base
│   ├── contexts/               # React Contexts (Auth, etc.)
│   ├── data/                   # Dades estàtiques
│   │   ├── courseStructure.ts  # Estructura de temes
│   │   ├── notes.ts            # Apunts
│   │   └── solutions.ts        # Solucionaris
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilitats i configuració
│   ├── pages/                  # Pàgines de l'aplicació
│   ├── utils/                  # Funcions utilitat
│   └── App.tsx                 # Component principal
├── .env                        # Variables d'entorn (NO PUJAR!)
├── .gitignore                  # Fitxers ignorats per Git
├── package.json                # Dependències del projecte
└── vite.config.ts              # Configuració de Vite
```

---

## 🧪 Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desenvolupament
npm run build    # Compila el projecte per a producció
npm run preview  # Preview de la build de producció
npm run lint     # Executa ESLint per revisar el codi
```

---

## 🐛 Reportar Bugs

Si trobes un bug, si us plau obre un **Issue** amb:

1. **Descripció clara** del problema
2. **Passos per reproduir** el bug
3. **Comportament esperat** vs. comportament actual
4. **Screenshots** (si és possible)
5. **Entorn** (navegador, sistema operatiu, etc.)

---

## 💡 Bones Pràctiques

### Seguretat
- ❌ **Mai** pugis el fitxer `.env` a GitHub
- ✅ Utilitza variables d'entorn per credencials
- ✅ Revisa que `.gitignore` està actualitzat abans de fer commit

### Codi
- ✅ Escriu codi TypeScript tipat (evita `any`)
- ✅ Utilitza components funcionals amb hooks
- ✅ Segueix la convenció de noms existent
- ✅ Comenta funcions complexes

### Commits
- ✅ Commits petits i atòmics
- ✅ Missatges descriptius
- ✅ Una funcionalitat per commit

---

## 📄 Llicència

Aquest projecte està sota llicència **MIT**. Veure el fitxer [LICENSE](LICENSE) per més detalls.

---

## 👥 Autors

- **CreatorSaWiX** - *Creador i mantenidor principal* - [@CreatorSaWiX](https://github.com/CreatorSaWiX)

### Contributors

Gràcies a totes les persones que han contribuït a aquest projecte! 🙏

*(Aquí apareixeràn automàticament els contributors quan facin Pull Requests)*

---

## 🌟 Suport

Si aquest projecte t'ha ajudat, considera:

- ⭐ Donar-li una estrella a GitHub
- 🍴 Fer un fork i contribuir
- 📢 Compartir-lo amb els teus companys
- 💬 Deixar comentaris o suggeriments

---

<div align="center">

**Fet amb ❤️ per estudiants FIB, per a estudiants 8)**

📚 PRO2 @ FIB - UPC

</div>
