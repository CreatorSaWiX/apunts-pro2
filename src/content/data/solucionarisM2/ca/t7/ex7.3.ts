import type { Solution } from "../../../solutions";

export const ex7_3: Solution = {
  id: "M2-T7-Ex3",
  title: "Exercici 3: Dibuix de corbes de nivell",
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Per a cada una de les funcions següents, dibuixeu les corbes de nivell corresponents als nivells $z = -2, -1, 0, 1, 2$:

  a) $z(x,y) = x^2 - y^2$
  
  b) $z(x,y) = 1 - |x| - |y|$`,
  content: `
### a) Corbes de nivell de $z(x,y) = x^2 - y^2$

Aquesta funció representa un **paraboloide hiperbòlic** (conegut com a sella de muntar). Les corbes de nivell s'obtenen igualant la funció a una constant $k$:
$$x^2 - y^2 = k$$

Analitzem els casos:
1.  **Si $k > 0$**: Són **hipèrboles** que s'obren en l'eix $X$. Per exemple, si $k=1$, tenim $x^2 - y^2 = 1$.
2.  **Si $k < 0$**: Són **hipèrboles** que s'obren en l'eix $Y$. Per exemple, si $k=-1$, tenim $y^2 - x^2 = 1$.
3.  **Si $k = 0$**: Tenim $x^2 - y^2 = 0 \\implies (x-y)(x+y) = 0$. Això representa les dues **rectes bisectrius** $y=x$ i $y=-x$.

::three{type="vis_ex7_3_a"}

---

### b) Corbes de nivell de $z(x,y) = 1 - |x| - |y|$

Aquesta funció té una forma de piràmide de base quadrada amb el vèrtex a $(0,0,1)$. Igualem a $k$:
$$1 - |x| - |y| = k \\implies |x| + |y| = 1 - k$$

Perquè hi hagi solució, cal que $1-k \\ge 0 \\implies k \\le 1$.
- Les corbes de nivell són **quadrats** rotats 45° (rombes) centrats a l'origen.
- La mida del quadrat disminueix a mesura que $k$ s'apropa a 1.
- Per a $k=1$, la corba és només el punt $(0,0)$.
- Per a $k > 1$, el conjunt de nivell és buit.

::three{type="vis_ex7_3_b"}
`
};
