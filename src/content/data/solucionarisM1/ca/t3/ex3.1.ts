import type { Solution } from '../../../solutions';

export const ex3_1: Solution = {
  id: 'M1-T3-Ex3.1',
  title: 'Exercici 3.1: Existència de Circuits Eulerians',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Per a cadascun dels grafs següents, trobeu-ne un circuit eulerià, o demostreu-ne la no existència.
  
  <img src="/src/assets/apunts/m1/T3Ex1.png" className="w-full max-w-2xl mx-auto rounded-2xl border border-white/10 shadow-xl my-6" />`,
  content: `
Recordem el **Teorema d'Euler**: Un graf connex té un circuit eulerià si i només si **tots els seus vèrtexs tenen grau parell**.

### Anàlisi de Graus

Per demostrar que un graf NO és eulerià, n'hi ha prou amb trobar un sol vèrtex de grau senar.

| Graf | Connex? | Graus dels vèrtexs | Eulerià? | Raonament |
| :--- | :---: | :--- | :---: | :--- |
| **$G_1$** | Sí | Conté vèrtexs de grau 3 | **NO** | Exemple: els vèrtexs de les cantonades superiors. |
| **$G_2$** | Sí | Tots els vèrtexs tenen grau 3 | **NO** | És un graf 3-regular (Prisma quadrangular). |
| **$G_3$** | Sí | Tots els vèrtexs tenen grau 3 | **NO** | També és un graf 3-regular. |
| **$G_4$** | Sí | Conté vèrtexs de grau 3 | **NO** | Els vèrtexs inferiors tenen grau senar. |
| **$G_5$** | Sí | Tots els vèrtexs tenen grau 4 o 6 | **SÍ** | Tots els graus són parells. |
| **$G_6$** | Sí | Tots els vèrtexs tenen grau 4 | **SÍ** | És l'octaedre (4-regular). |
| **$G_7$** | Sí | Tots els vèrtexs tenen grau 3 | **NO** | Graf 3-regular. |
| **$G_8$** | Sí | Centre (8), d'altres (4 i 2) | **SÍ** | Tots els graus són parells. |
| **$G_9$** | Sí | Tots els vèrtexs tenen grau 3 | **NO** | El dodecaedre és 3-regular. |
| **$G_{10}$** | Sí | Tots els vèrtexs tenen grau 3 | **NO** | El graf de Petersen és 3-regular. |
  `,
  availableLanguages: ['ca']
};
