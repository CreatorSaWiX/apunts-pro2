import type { Solution } from '../../../solutions';

export const ex6_22: Solution = {
  id: 'M1-T6-Ex6.22',
  title: 'Exercici 6.22: Veritat o Fals sobre Independència i Generadors',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Esbrineu si les afirmacions següents sobre conjunts de vectors en un espai vectorial $E$ són certes, demostrant-ho si és el cas i donant-ne un contraexemple altrament.

1) Si $\\{e_1, \\dots, e_r\\}$ és un conjunt LI i $v \\neq e_i$ per a tot $i$, aleshores $\\{e_1, \\dots, e_r, v\\}$ és LI.
2) Si $\\{e_1, \\dots, e_r\\}$ és un conjunt LI i $v \\notin \\langle e_1, \\dots, e_r \\rangle$, aleshores $\\{e_1, \\dots, e_r, v\\}$ és LI.
3) Si $\\{e_1, \\dots, e_r\\}$ és un conjunt generador de $E$ i $v \\neq e_i$ per a tot $i$, aleshores $\\{e_1, \\dots, e_r, v\\}$ és un conjunt generador de $E$.
4) Si $\\{e_1, \\dots, e_r\\}$ és un conjunt generador de $E$ i $e_r \\in \\langle e_1, \\dots, e_{r-1} \\rangle$, aleshores $\\{e_1, \\dots, e_{r-1} \\}$ és un conjunt generador de $E$.
5) Tot conjunt amb un sol vector és linealment independent.`,
  content: `
### 1) Fals
El fet que $v$ no sigui idèntic a cap dels vectors del conjunt no garanteix que no sigui una combinació lineal d'ells.
*   **Contraexemple**: A $\\mathbb{R}^2$, sigui $e_1 = (1, 0)$. El conjunt $\\{e_1\\}$ és LI. Sigui $v = (2, 0)$. Es compleix que $v \\neq e_1$, però el conjunt $\\{ (1,0), (2,0) \\}$ és LD ja que $v = 2e_1$.

### 2) Cert
Aquesta és la propietat d'extensió de conjunts LI.
*   **Demostració**: Suposem que $c_1 e_1 + \\dots + c_r e_r + c v = 0$. Si $c \\neq 0$, podríem aïllar $v$ com a combinació lineal dels $e_i$, cosa que contradiu la hipòtesi $v \\notin \\langle e_1, \\dots, e_r \\rangle$. Per tant, $c = 0$. Llavors ens queda $\\sum c_i e_i = 0$, i com que els $e_i$ són LI, tots els $c_i$ han de ser zero. Com que tots els coeficients són zero, el conjunt és LI.

### 3) Cert
Afegir vectors a un conjunt generador no pot reduir l'espai que aquest genera.
*   **Raonament**: Si $\\langle e_1, \\dots, e_r \\rangle = E$, llavors qualsevol vector de $E$ (inclòs $v$) ja es pot generar. Per tant, $\\langle e_1, \\dots, e_r, v \\rangle = E$, i el nou conjunt segueix generant $E$.

### 4) Cert
Aquesta és la propietat de reducció de conjunts generadors.
*   **Raonament**: Si $e_r$ es pot escriure com a combinació lineal de la resta, qualsevol vector que utilitzés $e_r$ per ser generat pot substituir $e_r$ per la seva combinació lineal corresponent. L'espai generat no canvia: $\\langle e_1, \\dots, e_r \\rangle = \\langle e_1, \\dots, e_{r-1} \\rangle$.

### 5) Fals
Cal tenir en compte el vector nul.
*   **Contraexemple**: El conjunt $\\{ \\vec{0} \\}$ és **linealment dependent**, ja que la combinació lineal $c \\cdot \\vec{0} = \\vec{0}$ admet solucions no nuls (qualsevol $c \\neq 0$). Qualsevol altre conjunt $\\{v\\}$ amb $v \\neq \\vec{0}$ sí que seria LI.
`,
  availableLanguages: ['ca']
};
