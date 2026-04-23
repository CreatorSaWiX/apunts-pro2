import type { Solution } from '../../../solutions';

export const ex7_8: Solution = {
  id: 'M2-T7-Ex8',
  title: 'Exercici 8: Corbes de nivell',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Per a cada una de les funcions següents, dibuixeu les corbes de nivell corresponents als nivells $z = -2, -1, 0, 1, 2$:

a) $z(x,y) = x^2 y$;

b) $z(x,y) = x^2 + y^2 - 1$;

c) $z(x,y) = |x + y| + |x - y|$.`,
  content: `
### a) Corbes de nivell de $z = x^2 y$

L'expressió de les corbes de nivell és $x^2 y = k$.
- Si **$k = 0$**: $x^2 y = 0 \\implies x=0$ o $y=0$. La corba de nivell 0 són els propis eixos de coordenades.
- Si **$k \\ne 0$**: Podem aïllar $y = \\frac{k}{x^2}$. 
    - Són corbes simètriques respecte l'eix d'ordenades ($y$).
    - Si $k > 0$, la corba està totalment per sobre de l'eix X.
    - Si $k < 0$, la corba està totalment per sota de l'eix X.

::three{type="vis_ex_7_8_a"}

---

### b) Corbes de nivell de $z = x^2 + y^2 - 1$

L'expressió és $x^2 + y^2 - 1 = k \\implies x^2 + y^2 = k + 1$.
Representen circumferències centrades a l'origen amb radi $R = \\sqrt{k+1}$.
- El domini de valors de $z$ és $[-1, \\infty)$. Per a $k = -2$, la corba de nivell és el buit.
- Per a **$k = -1$**, el radi és 0, per tant és el punt $(0,0)$.
- Per a **$k = 0$**, és la circumferència unitat $x^2 + y^2 = 1$.
- Per a **$k = 1, 2$**, són circumferències de radi $\\sqrt{2}$ i $\\sqrt{3}$ respectivament.

::three{type="vis_ex_7_8_b"}

---

### c) Corbes de nivell de $z = |x + y| + |x - y|$

Podem simplificar aquesta expressió utilitzant la propietat $|a+b| + |a-b| = 2 \\max(|a|, |b|)$.
Així, $z = 2 \\max(|x|, |y|)$. Les corbes de nivell són:
$$2\\max(|x|, |y|) = k \\implies \\max(|x|, |y|) = \\frac{k}{2}$$
Aquesta equació defineix **quadrats** centrats a l'origen amb costats paral·lels als eixos i de longitud $k$.
- Si $k = 0$, és el punt $(0,0)$.
- Si $k > 0$, tenim quadrats que van creixent a mesura que augmentem $k$.

::three{type="vis_ex_7_8_c"}
`,
  availableLanguages: ['ca']
};
