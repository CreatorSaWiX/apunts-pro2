import type { Solution } from '../../../solutions';

export const ex3_15: Solution = {
   id: 'M1-T3-Ex3.15',
   title: 'Exercici 3.15: Hamiltonianitat del Graf Complementari',
   author: 'SaWiX',
   code: '',
   type: 'notebook',
   statement: `Sigui $G$ un graf $d$-regular d'ordre $\\ge 2d+2$, amb $d \\ge 1$. Demostreu que el complementari de $G$ és hamiltonià.`,
   content: `
Per demostrar que el graf complementari $\\bar{G}$ és hamiltonià, utilitzarem el **Teorema de Dirac**.

### Teorema de Dirac
Un graf simple amb $n$ vèrtexs ($n \\ge 3$) és hamiltonià si cada vèrtex $v$ té un grau $g(v) \\ge \\frac{n}{2}$.

### Demostració

1. **Grau en el graf original ($G$)**:
   Se'ns diu que $G$ és un graf $d$-regular. Això significa que per a tot vèrtex $v$:
   $$g_G(v) = d$$

2. **Grau en el graf complementari ($\\bar{G}$)**:
   En el complementari $\\bar{G}$, un vèrtex està connectat a tots els vèrtexs als quals no estava connectat en $G$. Per tant, el grau de qualsevol vèrtex en $\\bar{G}$ és:
   $$g_{\\bar{G}}(v) = (n - 1) - g_G(v) = n - 1 - d$$

3. **Aplicació de la condició de Dirac**:
   Volem veure si es compleix que $g_{\\bar{G}}(v) \\ge \\frac{n}{2}$. Substituïm el valor del grau:
   $$n - 1 - d \\ge \\frac{n}{2}$$
   
   Reordenem la inequació per aïllar $n$:
   $$n - \\frac{n}{2} \\ge d + 1$$
   $$\\frac{n}{2} \\ge d + 1$$
   $$n \\ge 2d + 2$$

4. **Verificació de les hipòtesis**:
   - L'enunciat ens dóna precisament la condició **$n \\ge 2d + 2$**.
   - També hem de comprovar que $n \\ge 3$. Com que $d \\ge 1$, llavors $n \\ge 2(1) + 2 = 4$. Per tant, $n \\ge 3$ es compleix sempre.

### Conclusió
Com que el grau de cada vèrtex en $\\bar{G}$ és almenys la meitat de l'ordre del graf, pel Teorema de Dirac, el graf complementari **$\\bar{G}$ és hamiltonià**.

---

:::tip{title="Exemple pràctic"}
Si $G$ és un graf 1-regular (un aparellament) de 4 vèrtexs ($n=4, d=1$), $2d+2 = 4$. La condició es compleix.
El complementari $\\bar{G}$ tindrà vèrtexs de grau $4-1-1 = 2$. Un graf de 4 vèrtexs on tots tenen grau 2 és un cicle $C_4$, que és hamiltonià.
:::
  `,
   availableLanguages: ['ca']
};
