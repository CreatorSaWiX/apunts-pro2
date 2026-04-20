import type { Solution } from '../../../solutions';

export const ex7_1: Solution = {
  id: 'M2-T7-Ex1',
  title: 'Exercici 1: Topologia a R^2',
  author: 'asdf',
  code: '',
  type: 'notebook',
  statement: `Considereu els conjunts:
  
$A = \\{(x,y) \\in \\mathbb{R}^2 : x^2 + y^2 < 1\\}$

$B = \\{(x,y) \\in \\mathbb{R}^2 : |y| \\le x^2, y \\ne 0, x \\in [-2, 2]\\}$

a) Dibuixeu aquests conjunts.

b) Trobeu la frontera, l'interior i l'adherència d'aquests conjunts.

c) Són conjunts oberts? Són conjunts tancats?

d) Són conjunts compactes?`,
  content: `
### a) Dibuix dels conjunts

*   **Conjunt A**: És el disc unitat obert centrat a l'origen $(0,0)$. Inclou tots els punts la distància dels quals a l'origen és estrictament menor que 1. Gràficament, és el cercle de radi 1 amb la vora (la circumferència) dibuixada amb línia discontínua.

::mafs{type="ex_7_1_a"}

*   **Conjunt B**: És la regió compresa entre les paràboles $y = x^2$ i $y = -x^2$ per a $x$ entre $-2$ i $2$, però **excloent** l'eix d'abscisses ($y = 0$). Són dues "ales" que surten de l'origen però sense incloure el segment horitzontal de l'eix $X$ que les uneix ni el propi origen $(0,0)$.

::mafs{type="ex_7_1_b"}

---

### b) Topologia dels conjunts

Recordem que:
- **$S^\\circ$** (Interior): Punts que pertanyen a $S$ amb un entorn totalment contingut en $S$.
- **$\\bar{S}$** (Adherència): Conjunt de punts que són límit de successions de $S$.
- **$Fr(S)$** (Frontera): Punts que compleixen $\\bar{S} \\setminus S^\\circ$.

### Per al conjunt $A$:
L'expressió $x^2 + y^2 < 1$ ja defineix un conjunt obert.
- **$A^\\circ$**: $A = \\{(x,y) \\in \\mathbb{R}^2 : x^2 + y^2 < 1\\}$
- **$\\bar{A}$**: $\\{(x,y) \\in \\mathbb{R}^2 : x^2 + y^2 \\le 1\\}$ (el disc tancat)
- **$Fr(A)$**: $\\{(x,y) \\in \\mathbb{R}^2 : x^2 + y^2 = 1\\}$ (la circumferència unitat)

### Per al conjunt $B$:
El conjunt $B$ té punts "a la vora" (les paràboles) però li falta el segment central.
- **$\\bar{B}$**: $\\{(x,y) \\in \\mathbb{R}^2 : |y| \\le x^2, x \\in [-2, 2]\\}$. Noteu que aquí la condició $y \\ne 0$ desapareix perquè els punts amb $y=0$ són punts d'acumulació de $B$.
- **$B^\\circ$**: $\\{(x,y) \\in \\mathbb{R}^2 : |y| < x^2, y \\ne 0, x \\in (-2, 2)\\}$.
- **$Fr(B)$**: Està formada per les corbes $y = x^2$ i $y = -x^2$ per a $x \\in [-2, 2]$, els segments verticals $x = \\pm 2$ per a $y \\in [-4, 4]$, i el segment de l'eix $X$: $\\{(x, 0) : x \\in [-2, 2]\\}$.

---

### c) Obertura i tancament

- **Conjunt A**: És **obert**, ja que $A = A^\\circ$. No és tancat ($Fr(A) \\not\\subset A$).
- **Conjunt B**:
    - **No és obert**: Conté punts de la seva frontera (com els punts sobre les paràboles amb $x \\ne 0$). Qualsevol entorn d'un d'aquests punts s'escapa de $B$.
    - **No és tancat**: No conté tota la seva frontera ($Fr(B) \\not\\subset B$). Per exemple, el punt $(1, 0) \\in Fr(B)$ però no és de $B$ perquè $y = 0$.

---

### d) Compacitat

Un conjunt a $\\mathbb{R}^n$ és **compacte** si i només si és **tancat i acotat**.

- **Conjunt A**: És acotat però **no és tancat**. Per tant, **no és compacte**.
- **Conjunt B**: És acotat però **no és tancat**. Per tant, **no és compacte**.
`,
  availableLanguages: ['ca']
};
