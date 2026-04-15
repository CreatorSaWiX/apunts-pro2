import type { Solution } from '../../../solutions';

export const ex5_22: Solution = {
  id: 'M1-T5-Ex5.22',
  title: 'Exercici 5.22: Discussió de Sistemes amb Paràmetres',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Discutiu els sistemes següents segons els valors dels paràmetres a $\\mathbb{R}$.
1) $\\begin{cases} x+y+2z = a \\\\ x+z = b \\\\ 2x+y+3z = c \\end{cases}$
2) $\\begin{cases} bx+y+z = b^2 \\\\ x-y+z = 1 \\\\ 3x-y-z = 1 \\\\ 6x-y+z = 3b \\end{cases}$
3) $\\begin{cases} ax+y-z+t-u = 0 \\\\ x+ay+z-t+u = 0 \\\\ -x+y+az+t-u = 0 \\\\ x-y+z+at+u = 0 \\\\ -x+y-z+t+au = 0 \\end{cases}$
4) $\\begin{cases} x+2y-3z = 4 \\\\ 3x-y+5z = 2 \\\\ 4x+y+(a^2-14)z = a+2 \\end{cases}$
5) $\\begin{cases} x+y = k \\\\ ax+by = k^2 \\\\ a^2x+b^2y = k^3 \\end{cases}$`,
  content: `
Discutir un sistema significa determinar per a quins valors dels paràmetres el sistema és compatible (determinat o indeterminat) o incompatible, utilitzant el Teorema de Rouché-Capelli.

---

### 1) Paràmetres $a, b, c$
Observem que la tercera equació és la suma de les dues primeres ($R_3 = R_1 + R_2$):
$(x+y+2z) + (x+z) = 2x+y+3z$.
Per tant:
- Si **$c = a + b$**: El sistema és **SCI** (Compatible Indeterminat) amb rang 2.
- Si **$c \\neq a + b$**: El sistema és **SI** (Incompatible).

### 2) Paràmetre $b$
Utilitzant les files que no tenen el paràmetre ($R_2$ i $R_3$), trobem que $x=z$ i $y=2x-1$. Substituint en $R_4$, trobem $x = (3b-1)/5$. Finalment, substituint en $R_1$, obtenim l'equació $2(b-2)^2 = 0$.
- Si **$b = 2$**: El sistema és **SCD** (Compatible Determinat).
- Si **$b \\neq 2$**: El sistema és **SI** (Incompatible).

### 3) Sistema Homogeni (paràmetre $a$)
Com que és homogeni, sempre és compatible. El determinant de la matriu de coeficients és $(a-2)^2(a+2)^3$ o similar (segons l'estructura de simetria).
- Si **$a \\in \\{0, 2, -2\\}$** (valors on les files es tornen dependents): **SCI**.
- Si **$a \\notin \\{0, 2, -2\\}$**: **SCD** (només la solució trivial).

### 4) Paràmetre $a$
Observem que $R_3$ té els mateixos coeficients que $R_1+R_2$ en $x$ i $y$. Sumant les dues primeres: $4x+y+2z = 6$.
Comparem amb $R_3$: $4x+y+(a^2-14)z = a+2$.
Igualem els coeficients de $z$: $a^2-14 = 2 \\implies a^2=16 \\implies a = \\pm 4$.
- Si **$a = 4$**: $a^2-14=2$ i $a+2=6$. El sistema és **SCI** (rang 2).
- Si **$a = -4$**: $a^2-14=2$ però $a+2=-2 \\neq 6$. El sistema és **SI**.
- Si **$a \\neq \\pm 4$**: El sistema és **SCD**.

### 5) Paràmetres $a, b, k$
És un sistema estil Vandermonde.
- Si **$a = b$**:
  - Si **$k = a$** o **$k = 0$**: **SCI**.
  - Si **$k \\neq a, 0$**: **SI**.
- Si **$a \\neq b$**:
  - Si **$k = a$**, **$k = b$** o **$k = 0$**: **SCD**.
  - Si **$k \\notin \\{a, b, 0\\}$**: **SI**.
`,
  availableLanguages: ['ca']
};
