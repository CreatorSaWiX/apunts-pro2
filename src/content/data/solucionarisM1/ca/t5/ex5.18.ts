import type { Solution } from '../../../solutions';

export const ex5_18: Solution = {
  id: 'M1-T5-Ex5.18',
  title: 'Exercici 5.18: Teorema de Rouché-Capelli',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Responeu raonadament les preguntes següents:
1) Quin és el rang de la matriu associada a un sistema compatible determinat amb 5 equacions i 4 incògnites? I si el sistema és compatible indeterminat?
2) Quantes equacions com a mínim són necessàries per tenir un sistema compatible indeterminat amb 2 graus de llibertat i rang 3? Quantes incògnites tindrà aquest sistema?
3) Pot ser compatible determinat un sistema amb 7 equacions i 10 incògnites?
4) És possible que un sistema lineal amb menys equacions que incògnites sigui incompatible?
5) Inventeu un sistema compatible determinat, un sistema compatible indeterminat i un sistema incompatible, tots ells amb 3 incògnites i 4 equacions.`,
  content: `
Aquest exercici requereix l'aplicació del **Teorema de Rouché-Capelli**, que relaciona el rang de la matriu de coeficients ($A$), el rang de la matriu ampliada ($A|b$) i el nombre d'incògnites ($n$).

---

### 1) Sistema amb 5 equacions i 4 incògnites ($n=4$)
Com que el sistema és compatible (té solució), el $\\text{rang}(A) = \\text{rang}(A|b)$.
- **Si és determinat (SCD)**: El rang ha de ser igual al nombre d'incògnites. Per tant, **rang = 4**.
- **Si és indeterminat (SCI)**: El rang ha de ser inferior al nombre d'incògnites. Per tant, el **rang < 4** (pot ser 1, 2 o 3).

### 2) SCI amb 2 graus de llibertat i rang 3
Els **graus de llibertat** es calculen com la diferència entre el nombre d'incògnites i el rang ($n - r$).
- $n - 3 = 2 \\implies n = 5$. El sistema té **5 incògnites**.
- Com que el rang és 3, necessitem com a mínim 3 files linealment independents. Per tant, calen **com a mínim 3 equacions** (tot i que el més habitual seria tenir-ne almenys 5 per "omplir" el sistema, teòricament amb 3 n'hi ha prou per tenir rang 3).

### 3) Sistema amb 7 equacions ($m$) i 10 incògnites ($n$)
Perquè sigui compatible determinat (SCD), el rang hauria de ser igual al nombre d'incògnites ($n=10$).
No obstant això, el rang d'una matriu no pot superar mai el seu nombre més petit de dimensions: $\\text{rang}(A) \\le \\min(m, n) = \\min(7, 10) = 7$.
Com que el rang màxim és 7 i necessitaríem rang 10, **NO pot ser compatible determinat**.

### 4) Equacions < incògnites i incompatibilitat
**SÍ, és possible**. Que hi hagi poques equacions no garanteix que no hi hagi contradiccions.
*Exemple:* $x + y + z = 1$ i $x + y + z = 2$. Hi ha 2 equacions i 3 incògnites, però el sistema no té solució ($1 \\neq 2$).

### 5) Exemples (3 incògnites, 4 equacions)

- **SCD (Compatible Determinat)**: $\\text{rang}=3$
  $$\\begin{cases} x = 1 \\\\ y = 1 \\\\ z = 1 \\\\ x + y + z = 3 \\end{cases}$$
- **SCI (Compatible Indeterminat)**: $\\text{rang}<3$
  $$\\begin{cases} x + y + z = 1 \\\\ 2x + 2y + 2z = 2 \\\\ 0 = 0 \\\\ 0 = 0 \\end{cases}$$
- **SI (Incompatible)**: $\\text{rang}(A) \\neq \\text{rang}(A|b)$
  $$\\begin{cases} x = 1 \\\\ x = 2 \\\\ y = 0 \\\\ z = 0 \\end{cases}$$
`,
  availableLanguages: ['ca']
};
