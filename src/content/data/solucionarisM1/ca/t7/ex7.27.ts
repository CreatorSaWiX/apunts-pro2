import type { Solution } from '../../../solutions';

export const ex7_27: Solution = {
  id: 'M1-T7-Ex7.27',
  title: 'Exercici 7.27: Commutativitat en 3D',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Siguin $f_1, f_2: \\mathbb{R}^3 \\to \\mathbb{R}^3$ aplicacions lineals. Determineu si $f_1 \\circ f_2 = f_2 \\circ f_1$ (si commuten) en els casos següents:

1) $f_1$ és un escalat de factor $k$ i $f_2$ és una rotació respecte l'eix $OZ$ d'angle $\\theta$;
2) $f_1$ és una rotació respecte l'eix $OX$ i $f_2$ és una rotació respecte l'eix $OZ$.`,
  content: `
Dues aplicacions lineals commuten si i només si el producte de les seves matrius associades és commutatiu: $M_1 \\cdot M_2 = M_2 \\cdot M_1$.

---

### 1) Escalat i Rotació
La matriu d'un escalat de factor $k$ és una matriu escalar (un múltiple de la identitat):
$$M_1 = k \\cdot I = \\begin{pmatrix} k & 0 & 0 \\\\ 0 & k & 0 \\\\ 0 & 0 & k \\end{pmatrix}$$
Com que les matrius escalars commuten amb qualsevol matriu quadrada del mateix ordre:
- $M_1 \\cdot M_2 = (k I) \\cdot M_2 = k M_2$
- $M_2 \\cdot M_1 = M_2 \\cdot (k I) = k M_2$

**Sí commuten.** L'ordre en què apliquem un escalat uniforme i una rotació no afecta el resultat final.

---

### 2) Rotacions respecte eixos diferents ($OX$ i $OZ$)
En general, les rotacions en l'espai $\\mathbb{R}^3$ **no commuten** si els eixos són diferents.

Considerem, per exemple, rotacions de $90^\\circ$ ($\\pi/2$):
- **Rotació $90^\\circ$ respecte $OX$ ($M_1$):**
  $M_1 = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 0 & -1 \\\\ 0 & 1 & 0 \\end{pmatrix}$
- **Rotació $90^\\circ$ respecte $OZ$ ($M_2$):**
  $M_2 = \\begin{pmatrix} 0 & -1 & 0 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$

**Productes:**
- $M_1 M_2 = \\begin{pmatrix} 0 & -1 & 0 \\\\ 0 & 0 & -1 \\\\ 1 & 0 & 0 \\end{pmatrix}$
- $M_2 M_1 = \\begin{pmatrix} 0 & 0 & 1 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0 \\end{pmatrix}$

Com que $M_1 M_2 \\neq M_2 M_1$:
**No commuten.** L'ordre de les rotacions en 3D és crucial.
`,
  availableLanguages: ['ca']
};
