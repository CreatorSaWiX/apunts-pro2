import type { Solution } from '../../../solutions';

export const ex7_10: Solution = {
  id: 'M1-T7-Ex7.10',
  title: 'Exercici 7.10: Matriu associada i base de la imatge',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $E$ un espai vectorial i $B = \{u, v, w, t\}$ una base d'aquest. Sigui $f$ un endomorfisme d'E tal que:

$f(u) = u + 2w, f(v) = v + w, f(w) = 2u + v + w, f(t) = 2u + 2v + 4w$.

Escriviu la matriu d'f en la base $B$, i trobeu una base i la dimensió de la imatge d'f.`,
  content: `
Per resoldre aquest exercici, primer expressarem les imatges dels vectors de la base $B$ en coordenades respecte a la mateixa base $B$, i després buscarem el rang d'aquesta matriu per trobar la dimensió de la imatge.

---

### 1) Matriu de $f$ en la base $B$

Busquem les coordenades de les imatges:
- $f(u) = 1u + 0v + 2w + 0t \\to (1, 0, 2, 0)_B$
- $f(v) = 0u + 1v + 1w + 0t \\to (0, 1, 1, 0)_B$
- $f(w) = 2u + 1v + 1w + 0t \\to (2, 1, 1, 0)_B$
- $f(t) = 2u + 2v + 4w + 0t \\to (2, 2, 4, 0)_B$

Col·loquem aquestes coordenades com a columnes de la matriu $M_B(f)$:

$$M_B(f) = \\begin{pmatrix} 1 & 0 & 2 & 2 \\\\ 0 & 1 & 1 & 2 \\\\ 2 & 1 & 1 & 4 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}$$

---

### 2) Dimensió i base de la imatge

La imatge de $f$, $\\text{Im } f$, està generada per les columnes de la matriu. Anem a calcular el rang de $M_B(f)$ mitjançant l'escalonament per files:

$$\\begin{pmatrix} 1 & 0 & 2 & 2 \\\\ 0 & 1 & 1 & 2 \\\\ 2 & 1 & 1 & 4 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix} \\xrightarrow{F_3 - 2F_1} \\begin{pmatrix} 1 & 0 & 2 & 2 \\\\ 0 & 1 & 1 & 2 \\\\ 0 & 1 & -3 & 0 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix} \\xrightarrow{F_3 - F_2} \\begin{pmatrix} 1 & 0 & 2 & 2 \\\\ 0 & 1 & 1 & 2 \\\\ 0 & 0 & -4 & -2 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}$$

El rang de la matriu és **3**. Per tant:
- **$\\text{dim}(\\text{Im } f) = 3$**

Com que el rang és 3, les tres primeres columnes són linealment independents i formen una base de la imatge. Una base de $\\text{Im } f$ expressada en els vectors originals és:

$$\\text{Base}(\\text{Im } f) = \\{ f(u), f(v), f(w) \\} = \\{ u+2w, \\, v+w, \\, 2u+v+w \\}$$

*(Nota: Qualsevol conjunt de 3 vectors independents generats per les columnes serviria, com per exemple $\\{u+2w, v+w, 2u+2v+4w\\}$).*
`,
  availableLanguages: ['ca']
};
