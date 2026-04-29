import type { Solution } from '../../../solutions';

export const ex7_1: Solution = {
  id: 'M2-T7-Ex1',
  title: 'Exercici 1: Topologia a R^2',
  author: 'SaWiX',
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
::mafs{type="ex_7_1_a"}

L'expressió $x^2 + y^2 < 1$ ja defineix un conjunt obert.
- **$A^\\circ$**: $A = \\{(x,y) \\in \\mathbb{R}^2 : x^2 + y^2 < 1\\}$
- **$\\bar{A}$**: $\\{(x,y) \\in \\mathbb{R}^2 : x^2 + y^2 \\le 1\\}$ (el disc tancat)
- **$Fr(A)$**: $\\{(x,y) \\in \\mathbb{R}^2 : x^2 + y^2 = 1\\}$ (la circumferència unitat)

És **obert**, ja que $A = A^\\circ$. No és tancat ($Fr(A) \\not\\subset A$).

Un conjunt a $\\mathbb{R}^n$ és **compacte** si i només si és **tancat i acotat**.
Com que és acotat però **no és tancat**. Per tant, **no és compacte**.

::mafs{type="ex_7_1_b"}

El conjunt $B$ té punts "a la vora" (les paràboles) però li falta el segment central.
- **$\\bar{B}$**: $\\{(x,y) \\in \\mathbb{R}^2 : |y| \\le x^2, x \\in [-2, 2]\\}$. Noteu que aquí la condició $y \\ne 0$ desapareix perquè els punts amb $y=0$ són punts d'acumulació de $B$.
- **$B^\\circ$**: $\\{(x,y) \\in \\mathbb{R}^2 : |y| < x^2, y \\ne 0, x \\in (-2, 2)\\}$.
- **$Fr(B)$**: Està formada per les corbes $y = x^2$ i $y = -x^2$ per a $x \\in [-2, 2]$, els segments verticals $x = \\pm 2$ per a $y \\in [-4, 4]$, i el segment de l'eix $X$: $\\{(x, 0) : x \\in [-2, 2]\\}$.

- **No és obert**: Conté punts de la seva frontera (com els punts sobre les paràboles amb $x \\ne 0$). Qualsevol entorn d'un d'aquests punts s'escapa de $B$.
- **No és tancat**: No conté tota la seva frontera ($Fr(B) \\not\\subset B$). Per exemple, el punt $(1, 0) \\in Fr(B)$ però no és de $B$ perquè $y = 0$.

És acotat però **no és tancat**. Per tant, **no és compacte**.
`,
  availableLanguages: ['ca']
};
