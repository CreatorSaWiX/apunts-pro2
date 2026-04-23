import type { Solution } from '../../../solutions';

export const ex2_12: Solution = {
  id: 'M1-T2-Ex2.12',
  title: 'Exercici 2.12: Ponts i Talls dependents als regulars',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Demostreu que un graf 3-regular té un vèrtex de tall si, i només si, té alguna aresta pont.`,
  content: `
Demostració de doble via ($\\iff$):

**1) Pont $\\implies$ Tall**  
Sabem que els extrems d'un pont són vèrtexs de tall, **a menys** que el vèrtex tingui grau 1 (sigui una fulla). Com que el nostre graf és **3-regular**, cada vèrtex té grau 3. Per tant, l'excepció no es pot donar i qualsevol extrem d'un pont serà un vèrtex de tall.

**2) Tall $\\implies$ Pont**  
Aquesta part és més subtil. Si $v$ és un vèrtex de tall, la seva eliminació desconnecta el graf en $k \\ge 2$ components.

::proofviz{proof="three_regular_cut_bridge"}

**Raonament algebraic:**
1. Sigui $v$ el vèrtex de tall. Com que el graf és 3-regular, d'ell surten exactament **3 arestes** cap als seus veïns $x, y, z$.
2. En eliminar $v$, aquestes 3 arestes desapareixen i el graf queda dividit en components connexos (per exemple, $C_1$ i $C_2$).
3. Els vèrtexs $x, y, z$ han de quedar repartits entre aquests components. Pel principi del colomar (3 veïns a repartir en $\\ge 2$ components), algun component (diguem $C_1$) ha de contenir **exactament un** d'aquests veïns (diguem $x$).
4. Si $x$ és l'únic vèrtex de $C_1$ que estava connectat a $v$, llavors l'aresta $xv$ era l'única connexió entre $C_1$ i la resta del graf.
5. Si una aresta és l'única connexió entre un component i el vèrtex $v$, la seva eliminació desconnectarà el graf. Per tant, **$xv$ és una aresta pont**. $\\square$
  `,
  availableLanguages: ['ca']
};
