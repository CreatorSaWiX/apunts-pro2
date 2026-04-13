import type { Solution } from '../../../solutions';

export const ex5_10: Solution = {
  id: 'M1-T5-Ex5.10',
  title: 'Exercici 5.10: Matrius amb Propietats Especials',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Siguin $I$ la matriu identitat i $O$ la matriu nul·la de $\\mathcal{M}_{2 \\times 2}(\\mathbb{R})$. Trobeu matrius $A, B, C, D, E \\in \\mathcal{M}_{2 \\times 2}(\\mathbb{R})$ tals:
1) $A^2 = I$ i $A \\neq I, -I$;
2) $B^2 = O$ i $B \\neq O$;
3) $C^2 = C$ i $C \\neq I, O$;
4) $DE = O$ però $E \\neq D$ i $ED \\neq O$.`,
  content: `
Aquest exercici ens ajuda a entendre que les propietats dels nombres reals (com que si $x^2=1 \\implies x = \\pm 1$ o si $ab=0 \\implies a=0$ o $b=0$) no sempre s'apliquen a les matrius.

### 1) Matriu Involutòria ($A^2 = I$)

Busquem una matriu que sigui la seva pròpia inversa. Una solució senzilla és una matriu que intercanviï les files (matriu de permutació):
$$A = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$$
**Comprovació:**
$$A^2 = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix} \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} = I$$
És clar que $A$ no és ni $I$ ni $-I$.

### 2) Matriu Nilpotent ($B^2 = O$)

Busquem una matriu no nul·la que, en elevar-la al quadrat, esdevingui la matriu nul·la. Podem utilitzar una matriu triangular superior amb zeros a la diagonal:
$$B = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$$
**Comprovació:**
$$B^2 = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix} \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix} = O$$

### 3) Matriu Idempotent ($C^2 = C$)

Busquem una matriu que sigui una projecció. Una matriu diagonal amb un 1 i un 0 a la diagonal principal funcionarà:
$$C = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$$
**Comprovació:**
$$C^2 = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix} \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix} = C$$
És clar que $C$ no és ni la identitat $I$ ni la matriu nul·la $O$.

### 4) Divisors de zero no commutatius ($DE = O, ED \\neq O$)

Busquem dues matrius $D$ i $E$ tals que el seu producte en un ordre sigui zero, però en l'altre no ho sigui:
Sigui $D = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$ i $E = \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}$.

**Comprovació $DE$:**
$$DE = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix} \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix} = \\begin{pmatrix} 1(0)+0(1) & 1(0)+0(0) \\\\ 0(0)+0(1) & 0(0)+0(0) \\end{pmatrix} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix} = O$$

**Comprovació $ED$:**
$$ED = \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix} \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 0(1)+0(0) & 0(0)+0(0) \\\\ 1(1)+0(0) & 1(0)+0(0) \\end{pmatrix} = \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix} \\neq O$$
Es compleixen totes les condicions, incloent $E \\neq D$.
`,
  availableLanguages: ['ca']
};
