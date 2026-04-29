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
Observem que la matriu de coeficients té rang 2, ja que la tercera fila és la suma de les dues primeres ($F_3 = F_1 + F_2$):
$(x+y+2z) + (x+z) = 2x+y+3z$.

Perquè el sistema sigui compatible, s'ha de complir la mateixa relació en els termes independents:
- Si **$c = a + b$**: El sistema és **SCI** (Compatible Indeterminat) amb rang 2.
- Si **$c \\neq a + b$**: El sistema és **SI** (Incompatible).

### 2) Paràmetre $b$
Per analitzar el sistema, utilitzem primer les files que no contenen el paràmetre ($F_2$ i $F_3$):
1. **Relació entre variables**:
   - Sumant $F_2$ i $F_3$: $(x-y+z) + (3x-y-z) = 1+1 \\implies 4x-2y = 2 \\implies y = 2x-1$.
   - Restant $F_3$ de $F_2$: $(x-y+z) - (3x-y-z) = 1-1 \\implies -2x+2z = 0 \\implies x = z$.
2. **Substitució en $F_4$**: Substituïm $y$ i $z$ en $6x-y+z = 3b$:
   $6x - (2x-1) + x = 3b \\implies 5x + 1 = 3b \\implies x = \\frac{3b-1}{5}$.
3. **Equació final en $b$**: Substituïm $x, y, z$ en $F_1$ ($bx+y+z = b^2$):
   $b\\left(\\frac{3b-1}{5}\\right) + \\left(2\\frac{3b-1}{5}-1\\right) + \\frac{3b-1}{5} = b^2$
   Multiplicant tota l'equació per $5$: $(3b^2-b) + (6b-2-5) + (3b-1) = 5b^2 \\implies 2b^2-8b+8 = 0 \\implies 2(b-2)^2 = 0$.

- Si **$b = 2$**: L'equació es compleix ($x=z=1, y=1$). El sistema és **SCD** (Compatible Determinat).
- Si **$b \\neq 2$**: No hi ha solució. El sistema és **SI** (Incompatible).

### 3) Sistema Homogeni (paràmetre $a$)
Com que és un sistema homogeni, sempre té almenys la solució trivial $(0,0,0,0,0)$. Serà compatible indeterminat si el determinant de la matriu $M$ és zero.
La matriu té una estructura simètrica que es pot escriure com $M = (a+1)I - vv^T$ on $v = (1, -1, 1, -1, 1)^T$. El seu determinant és $(a-4)(a+1)^4$.
- Si **$a = 4$**: El rang és 4. El sistema és **SCI**.
- Si **$a = -1$**: Totes les files es tornen proporcionals (rang 1). El sistema és **SCI**.
- Si **$a \\notin \\{4, -1\\}$**: El sistema és **SCD** (només la solució trivial).

### 4) Paràmetre $a$
Sumant les dues primeres equacions ($F_1+F_2$):
$(x+2y-3z) + (3x-y+5z) = 4+2 \\implies 4x+y+2z = 6$.
Comparem amb la tercera equació $F_3$: $4x+y+(a^2-14)z = a+2$.
- Si **$a = 4$**: $a^2-14=2$ i $a+2=6$. Les equacions són idèntiques. **SCI** (rang 2).
- Si **$a = -4$**: $a^2-14=2$ però $a+2=-2 \\neq 6$. Contradicció. **SI**.
- Si **$a \\neq \\pm 4$**: Els coeficients de $z$ són diferents, el sistema té rang 3. **SCD**.

### 5) Paràmetres $a, b, k$
El sistema és compatible si el determinant de la matriu ampliada ($3 \\times 3$) és zero. Aquest determinant és de tipus Vandermonde i val $(b-a)k(k-a)(k-b)$.
- Si **$a \\neq b$**:
  - Si **$k \\in \\{a, b, 0\\}$**: El sistema és **SCD**.
  - Si **$k \\notin \\{a, b, 0\\}$**: El sistema és **SI**.
- Si **$a = b$**:
  - Si **$k = a$** o **$k = 0$**: Les tres equacions es redueixen a una sola. **SCI**.
  - Si **$k \\neq a, 0$**: El sistema és **SI**.
`,
  availableLanguages: ['ca']
};
