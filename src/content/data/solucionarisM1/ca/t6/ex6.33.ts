import type { Solution } from '../../../solutions';

export const ex6_33: Solution = {
    id: 'M1-T6-Ex6.33',
    title: 'Exercici 6.33: Intersecció i Bases de Subespais',
    author: 'SaWiX',
    code: '',
    type: 'notebook',
    statement: `Doneu una base i la dimensió dels espais $E, F$ i $E \\cap F$ en els casos següents:

1) $E = \\{ (x, y, z) \\in \\mathbb{R}^3 : 2x = 2y = z \\}$ i $F = \\{ (x, y, z) \\in \\mathbb{R}^3 : x + y = z, \\, 3x + y + z = 0 \\}$.
2) $E = \\langle (1, 1, -1), (2, 0, -1), (0, 2, -1) \\rangle$ i $F = \\langle (1, 0, -1), (2, 3, 0), (4, 3, -2) \\rangle$ a $\\mathbb{R}^3$.
3) $E = \\{ (a, a+3b, 2a-b, c) : a,b,c \\in \\mathbb{R} \\}$ i $F = \\{ (-2a, b, 0, 3b) : a,b \\in \\mathbb{R} \\}$ a $\\mathbb{R}^4$.
4) $E = \\{ \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\in \\mathcal{M}_2(\\mathbb{R}) : a=b=c \\}$ i $F = \\left\\langle \\begin{pmatrix} 1 & 1 \\\\ 2 & 1 \\end{pmatrix}, \\begin{pmatrix} 2 & 0 \\\\ -1 & 1 \\end{pmatrix} \\right\\rangle$.`,
    content: `
### Cas 1: Rectes a $\\mathbb{R}^3$

*   **Subespai $E$**: Les equacions $2x=2y=z$ es poden escriure com a sistema:

    $\\begin{cases} 2x - z = 0 \\\\ 2y - z = 0 \\end{cases}$. Si donem el valor $z=2\\lambda$, obtenim $x=\\lambda, y=\\lambda$.

    Vector generador: $(1, 1, 2) \\implies \\mathcal{B}_E = \\{(1, 1, 2)\\}, \\dim(E)=1$.

*   **Subespai $F$**: Resolem el sistema d'equacions $\\begin{cases} x+y-z=0 \\\\ 3x+y+z=0 \\end{cases}$ per Gauss:
    
    $F_2 - 3F_1 \\implies -2y + 4z = 0 \\implies y = 2z$.

    Substituint a la primera: $x + 2z - z = 0 \\implies x = -z$.

    Si fem $z=\\lambda \\implies (-1, 2, 1) \\equiv (1, -2, -1)$.

    $\\mathcal{B}_F = \\{(1, -2, -1)\\}, \\dim(F)=1$.

*   **Intersecció $E \\cap F$**: Hem de veure si el generador de $E$ compleix les equacions de $F$.

    $x+y-z = 1+1-2 = 0$ (Compleix la 1a)

    $3x+y+z = 3(1)+1+2 = 6 \\neq 0$ (No compleix la 2a)

    Com que no són la mateixa recta, la intersecció és només el vector zero.

    **$\\dim(E \\cap F)=0, \\mathcal{B}_{E \\cap F} = \\emptyset$.**

---

### Cas 2: Plans a $\\mathbb{R}^3$

*   **Subespai $E$**: Comprovem el rang dels generadors:
    $\\begin{pmatrix} 1 & 1 & -1 \\\\ 2 & 0 & -1 \\\\ 0 & 2 & -1 \\end{pmatrix} \\xrightarrow{F_2-2F_1} \\begin{pmatrix} 1 & 1 & -1 \\\\ 0 & -2 & 1 \\\\ 0 & 2 & -1 \\end{pmatrix} \\to \\text{Rang 2}$.
    L'equació implícita es troba fent el determinant:
    $\\det\\begin{pmatrix} x & 1 & 2 \\\\ y & 1 & 0 \\\\ z & -1 & -1 \\end{pmatrix} = 0 \\implies -x - y - 2z = 0 \\implies x + y + 2z = 0$.
    $\\mathcal{B}_E = \\{(1, 1, -1), (2, 0, -1)\\}, \\dim(E)=2$.

*   **Subespai $F$**: El rang també és 2. Busquem l'equació:
    $\\det\\begin{pmatrix} x & 1 & 2 \\\\ y & 0 & 3 \\\\ z & -1 & 0 \\end{pmatrix} = 0 \\implies 3x - 2y + 3z = 0$.
    $\\mathcal{B}_F = \\{(1, 0, -1), (2, 3, 0)\\}, \\dim(F)=2$.

*   **Intersecció $E \\cap F$**: Ajuntem les dues equacions en un sistema:
    $\\begin{cases} x + y + 2z = 0 \\\\ 3x - 2y + 3z = 0 \\end{cases} \\xrightarrow{2F_1+F_2} 5x + 7z = 0 \\implies x = -\\frac{7}{5}z$.
    Substituint a la 1a: $-\\frac{7}{5}z + y + 2z = 0 \\implies y = \\frac{7}{5}z - \\frac{10}{5}z = -\\frac{3}{5}z$.
    Si fem $z=5 \\implies (-7, -3, 5)$.
    **$\\mathcal{B}_{E \\cap F} = \\{(-7, -3, 5)\\}, \\dim(E \\cap F)=1$.**

---

### Cas 3: Subespais a $\\mathbb{R}^4$

*   **Subespai $E$**: Separem per paràmetres: $(a, a, 2a, 0) + (0, 3b, -b, 0) + (0, 0, 0, c)$.
    
    Generadors: $v_1=(1, 1, 2, 0), v_2=(0, 3, -1, 0), v_3=(0, 0, 0, 1)$. Són LI (rang 3).

    Busquem l'equació implícita forçant rang a la matriu: $\\det \\dots \\implies 7x_1 - x_2 - 3x_3 = 0$.

    $\\mathcal{B}_E = \{(1, 1, 2, 0), (0, 3, -1, 0), (0, 0, 0, 1)\}, \dim(E)=3$.

*   **Subespai $F$**: Paramètricament $(-2a, b, 0, 3b) = a(-2, 0, 0, 0) + b(0, 1, 0, 3)$.

    $\\mathcal{B}_F = \\{(-2, 0, 0, 0), (0, 1, 0, 3)\\}, \\dim(F)=2$.

*   **Intersecció $E \\cap F$**: Agafem un vector genèric de $F$: $v = (-2a, b, 0, 3b)$ i el forcem a complir l'equació de $E$:

    $7(-2a) - (b) - 3(0) = 0 \\implies -14a - b = 0 \\implies b = -14a$.

    Substituïm $b$ al vector de $F$: $v = (-2a, -14a, 0, 3(-14a)) = (-2a, -14a, 0, -42a)$.

    Si fem $a=1$ i simplifiquem per $-2$: $(1, 7, 0, 21)$.

    **$\\mathcal{B}_{E \\cap F} = \\{(1, 7, 0, 21)\\}, \\dim(E \\cap F)=1$.**

---

### Cas 4: Subespais de matrius $\\mathcal{M}_2(\\mathbb{R})$

*   **Subespai $E$**: $a=b=c$. La forma genèrica és $\\begin{pmatrix} a & a \\\\ a & d \\end{pmatrix} = a\\begin{pmatrix} 1 & 1 \\\\ 1 & 0 \\end{pmatrix} + d\\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix}$.
    
    $\\mathcal{B}_E = \\{ \\begin{pmatrix} 1 & 1 \\\\ 1 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} \\}, \\dim(E)=2$.

*   **Subespai $F$**: Generat per dues matrius LI, $\\dim(F)=2$.

*   **Intersecció $E \\cap F$**: Una matriu genèrica de $F$ és $k_1 \\begin{pmatrix} 1 & 1 \\\\ 2 & 1 \\end{pmatrix} + k_2 \\begin{pmatrix} 2 & 0 \\\\ -1 & 1 \\end{pmatrix} = \\begin{pmatrix} k_1+2k_2 & k_1 \\\\ 2k_1-k_2 & k_1+k_2 \\end{pmatrix}$.

    Ara apliquem les condicions de $E$ ($a=b$ i $b=c$):
    
    1. $a=b \\implies k_1+2k_2 = k_1 \\implies 2k_2 = 0 \\implies k_2 = 0$.
    
    2. $b=c \\implies k_1 = 2k_1 - k_2$. Com que $k_2=0$, queda $k_1 = 2k_1 \\implies k_1 = 0$.
    
    Com que $k_1=0$ i $k_2=0$, l'única solució és la matriu nul·la.
    
    **$\\dim(E \\cap F)=0, \\mathcal{B}_{E \\cap F} = \\emptyset$.**
`,
    availableLanguages: ['ca']
};
