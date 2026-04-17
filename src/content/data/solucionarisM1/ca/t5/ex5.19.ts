import type { Solution } from '../../../solutions';

export const ex5_19: Solution = {
  id: 'M1-T5-Ex5.19',
  title: 'Exercici 5.19: Sistemes en el cos Z2',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Resoleu els sistemes lineals següents amb coeficients a $\\mathbb{Z}_2$. Useu eliminació gaussiana i doneu la solució en forma paramètrica.
1) $\\begin{cases} x + y = 1 \\\\ x + z = 0 \\\\ x + y + z = 1 \\end{cases}$
2) $\\begin{cases} x + y = 1 \\\\ y + z = 1 \\\\ x + z = 1 \\end{cases}$
3) $\\begin{cases} x + y = 0 \\\\ y + z = 0 \\\\ x + z = 0 \\end{cases}$`,
  content: `
Recordem que en $\\mathbb{Z}_2$, només hi ha dos elements: $\{0, 1\}$. Les operacions segueixen les regles:
- $1 + 1 = 0$ (per tant, sumar és el mateix que restar).
- $1 \\cdot 1 = 1$, $1 \\cdot 0 = 0$.

### 1) Primer sistema
Escrivim la matriu ampliada:
$$\\begin{pmatrix} 1 & 1 & 0 & | & 1 \\\\ 1 & 0 & 1 & | & 0 \\\\ 1 & 1 & 1 & | & 1 \\end{pmatrix}$$
Apliquem Gauss ($F_2 \\to F_2 + F_1$, $F_3 \\to F_3 + F_1$):
$$\\begin{pmatrix} 1 & 1 & 0 & | & 1 \\\\ 0 & 1 & 1 & | & 1 \\\\ 0 & 0 & 1 & | & 0 \\end{pmatrix}$$
D'on obtenim:
- $z = 0$
- $y + z = 1 \\implies y + 0 = 1 \\implies y = 1$
- $x + y = 1 \\implies x + 1 = 1 \\implies x = 0$

**Solució:** $(x, y, z) = (0, 1, 0)$.

### 2) Segon sistema
$$\\begin{pmatrix} 1 & 1 & 0 & | & 1 \\\\ 0 & 1 & 1 & | & 1 \\\\ 1 & 0 & 1 & | & 1 \\end{pmatrix}$$
Apliquem Gauss ($F_3 \\to F_3 + F_1$):
$$\\begin{pmatrix} 1 & 1 & 0 & | & 1 \\\\ 0 & 1 & 1 & | & 1 \\\\ 0 & 1 & 1 & | & 0 \\end{pmatrix}$$
Apliquem Gauss ($F_3 \\to F_3 + F_2$):
$$\\begin{pmatrix} 1 & 1 & 0 & | & 1 \\\\ 0 & 1 & 1 & | & 1 \\\\ 0 & 0 & 0 & | & 1 \\end{pmatrix}$$
L'última fila ens dóna $0 = 1$, la qual cosa és una contradicció. 
**Solució:** El sistema és **incompatible**.

### 3) Tercer sistema
És un sistema homogeni:
$$\\begin{pmatrix} 1 & 1 & 0 & | & 0 \\\\ 0 & 1 & 1 & | & 0 \\\\ 1 & 0 & 1 & | & 0 \\end{pmatrix} \\xrightarrow{F_3 + F_1} \\begin{pmatrix} 1 & 1 & 0 & | & 0 \\\\ 0 & 1 & 1 & | & 0 \\\\ 0 & 1 & 1 & | & 0 \\end{pmatrix} \\xrightarrow{F_3 + F_2} \\begin{pmatrix} 1 & 1 & 0 & | & 0 \\\\ 0 & 1 & 1 & | & 0 \\\\ 0 & 0 & 0 & | & 0 \\end{pmatrix}$$
Obtenim:
- $y + z = 0 \\implies y = z$
- $x + y = 0 \\implies x = y$

**Solució:** $x = y = z = \\lambda$.
En forma de conjunt: $\{(0, 0, 0), (1, 1, 1)\}$, o bé $(x, y, z) = \\lambda(1, 1, 1)$ amb $\\lambda \\in \\mathbb{Z}_2$.
`,
  availableLanguages: ['ca']
};
