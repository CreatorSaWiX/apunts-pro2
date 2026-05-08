import type { Solution } from '../../../solutions';

export const ex7_7: Solution = {
  id: 'M1-T7-Ex7.7',
  title: 'Exercici 7.7: Existència d\'aplicacions definides sobre subespais',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Per als següents subespais $E$ i $F$ de $\\mathbb{R}^4$, esbrineu si existeix una aplicació lineal $f: \\mathbb{R}^4 \\to \\mathbb{R}^4$ tal que $f(u) = 0$ per a tot $u \\in E$ i $f(v) = v$ per a tot $v \\in F$.

1) $E = \\left\\langle \\begin{pmatrix} 1 \\\\ 2 \\\\ -1 \\\\ 0 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ 1 \\\\ 0 \\\\ 2 \\end{pmatrix} \\right\\rangle$ i $F = \\left\\langle \\begin{pmatrix} 2 \\\\ 2 \\\\ 2 \\\\ 3 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ 1 \\\\ 0 \\\\ 1 \\end{pmatrix} \\right\\rangle$.

2) $E = \\left\\langle \\begin{pmatrix} 1 \\\\ 0 \\\\ -1 \\\\ 3 \\end{pmatrix}, \\begin{pmatrix} 4 \\\\ 1 \\\\ 0 \\\\ 2 \\end{pmatrix} \\right\\rangle$ i $F = \\left\\langle \\begin{pmatrix} 1 \\\\ 0 \\\\ 0 \\\\ 2 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ 1 \\\\ 1 \\\\ -5 \\end{pmatrix} \\right\\rangle$.`,
  content: ``,
  availableLanguages: ['ca']
};

// Perquè existeixi una aplicació lineal que compleixi $f(E) = \\{0\\}$ i $f(v) = v$ per a tot $v \\in F$, la condició necessària i suficient és que la intersecció dels dos subespais sigui només el vector zero:
// $$E \\cap F = \\{\\vec{0}\\}$$

// **Raonament:** Si existís un vector $w \\in E \\cap F$ tal que $w \\neq \\vec{0}$, per ser de $E$ hauria de complir $f(w) = \\vec{0}$, i per ser de $F$ hauria de complir $f(w) = w$. Això voldria dir que $w = \\vec{0}$, contradient que el vector és no nul.

// ---

// ### Apartat 1

// Anem a comprovar si els vectors que generen $E$ i $F$ són linealment independents entre ells. Si ho són, la intersecció serà $\\{\\vec{0}\\}$.
// Estudiem el rang de la matriu formada pels 4 vectors:

// $$\\begin{pmatrix} 1 & 2 & -1 & 0 \\\\ 1 & 1 & 0 & 2 \\\\ 2 & 2 & 2 & 3 \\\\ 1 & 1 & 0 & 1 \\end{pmatrix} \\xrightarrow[F_3-2F_4]{F_2-F_4} \\begin{pmatrix} 1 & 2 & -1 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ 0 & 0 & 2 & 1 \\\\ 1 & 1 & 0 & 1 \\end{pmatrix} \\xrightarrow{F_4-F_1} \\begin{pmatrix} 1 & 2 & -1 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ 0 & 0 & 2 & 1 \\\\ 0 & -1 & 1 & 1 \\end{pmatrix}$$

// Podem veure fàcilment que les files són independents (el determinant és no nul). Com que el rang és 4, els quatre vectors formen una base de $\\mathbb{R}^4$. Això implica que $E \\oplus F = \\mathbb{R}^4$ i, per tant, $E \\cap F = \\{\\vec{0}\\}$.

// En conclusió, **existeix una aplicació lineal** (i en aquest cas és única, ja que hem definit la imatge d'una base completa).

// ---

// ### Apartat 2

// Repetim el procés per al segon cas. Estudiem el rang:

// $$\\begin{pmatrix} 1 & 0 & -1 & 3 \\\\ 4 & 1 & 0 & 2 \\\\ 1 & 0 & 0 & 2 \\\\ 1 & 1 & 1 & -5 \\end{pmatrix} \\xrightarrow[F_2-4F_1, F_3-F_1]{F_4-F_1} \\begin{pmatrix} 1 & 0 & -1 & 3 \\\\ 0 & 1 & 4 & -10 \\\\ 0 & 0 & 1 & -1 \\\\ 0 & 1 & 2 & -8 \\end{pmatrix} \\xrightarrow{F_4-F_2} \\begin{pmatrix} 1 & 0 & -1 & 3 \\\\ 0 & 1 & 4 & -10 \\\\ 0 & 0 & 1 & -1 \\\\ 0 & 0 & -2 & 2 \\end{pmatrix}$$

// Observem que la darrera fila és $-2$ vegades la tercera ($F_4 = -2F_3$). Per tant, el rang és 3. Això significa que els vectors són linealment dependents i que hi ha una intersecció no trivial.

// Busquem un vector $w \\in E \\cap F$:
// Un vector de $E$ és $a(1,0,-1,3) + b(4,1,0,2)$ i un de $F$ és $c(1,0,0,2) + d(1,1,1,-5)$.
// Igualant components arribem a que per $a=-1, b=1, c=2, d=1$:
// $$w = -1\\begin{pmatrix} 1 \\\\ 0 \\\\ -1 \\\\ 3 \\end{pmatrix} + 1\\begin{pmatrix} 4 \\\\ 1 \\\\ 0 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 1 \\\\ 1 \\\\ -1 \\end{pmatrix}$$
// $$w = 2\\begin{pmatrix} 1 \\\\ 0 \\\\ 0 \\\\ 2 \\end{pmatrix} + 1\\begin{pmatrix} 1 \\\\ 1 \\\\ 1 \\\\ -5 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 1 \\\\ 1 \\\\ -1 \\end{pmatrix}$$

// Com que $w \\in E$, hauria de ser $f(w) = \\vec{0}$. Com que $w \\in F$, hauria de ser $f(w) = w$.
// Això implicaria $w = \\vec{0}$, però hem trobat que $w = (3, 1, 1, -1) \\neq \\vec{0}$.

// Per tant, **no existeix cap aplicació lineal** que compleixi les condicions.
