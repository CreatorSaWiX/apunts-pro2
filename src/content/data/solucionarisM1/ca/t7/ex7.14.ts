import type { Solution } from '../../../solutions';

export const ex7_14: Solution = {
  id: 'M1-T7-Ex7.14',
  title: 'Exercici 7.14: Endomorfisme bijectiu de matrius',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $B$ una matriu invertible $n \\times n$. Demostreu que l'aplicació $f: \\mathcal{M}_n(\\mathbb{R}) \\to \\mathcal{M}_n(\\mathbb{R})$ definida per $f(A) = AB$ és un endomorfisme bijectiu.`,
  content: `
Per demostrar que $f$ és un endomorfisme bijectiu, hem de provar dos punts: que és una aplicació lineal (endomorfisme) i que és bijectiva.

---

### 1) Demostració de la linealitat (Endomorfisme)

Una aplicació és un endomorfisme si és lineal i va d'un espai a si mateix. Clarament, si $A$ és $n \\times n$, llavors $AB$ també és $n \\times n$. Comprovem la linealitat:

- **Suma:** Siguin $A_1, A_2 \\in \\mathcal{M}_n(\\mathbb{R})$:
  $$f(A_1 + A_2) = (A_1 + A_2)B = A_1 B + A_2 B = f(A_1) + f(A_2)$$
  *(Per la propietat distributiva del producte de matrius).*

- **Producte per escalar:** Sigui $\\lambda \\in \\mathbb{R}$ i $A \\in \\mathcal{M}_n(\\mathbb{R})$:
  $$f(\\lambda A) = (\\lambda A)B = \\lambda (AB) = \\lambda f(A)$$
  *(Per la propietat de l'escalar en el producte de matrius).*

Per tant, $f$ és un endomorfisme.

---

### 2) Demostració de la bijectivitat

Com que $\\mathcal{M}_n(\\mathbb{R})$ és un espai de dimensió finita ($n^2$), per demostrar que un endomorfisme és bijectiu n'hi ha prou amb veure que és **injectiu** (és a dir, que el seu nucli és només la matriu nul·la).

Suposem que $A \\in \\ker f$. Llavors:
$$f(A) = \\mathbf{0} \\implies AB = \\mathbf{0}$$

Com que l'enunciat ens diu que $B$ és una matriu **invertible**, existeix la matriu $B^{-1}$. Multipliquem per la dreta a ambdós costats de la igualtat:
$$(AB)B^{-1} = \\mathbf{0} \\cdot B^{-1}$$
$$A(BB^{-1}) = \\mathbf{0}$$
$$A \\cdot I = \\mathbf{0} \\implies A = \\mathbf{0}$$

Això prova que l'únic element del nucli és la matriu nul·la ($\\ker f = \\{\\mathbf{0}\\}$), per tant $f$ és injectiva i, en ser un endomorfisme d'un espai finit, també és bijectiva.

**Nota addicional:** També podríem haver demostrat la bijectivitat definint directament l'aplicació inversa $f^{-1}(X) = XB^{-1}$.
`,
  availableLanguages: ['ca']
};
