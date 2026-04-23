import type { Solution } from '../../../solutions';

export const ex2_13: Solution = {
    id: 'M1-T2-Ex2.13',
    title: 'Exercici 2.13: Propietats del Complementari i els talls',
    author: 'SaWiX',
    code: '',
    type: 'notebook',
    statement: `Siguin $G = (V, A)$ un graf i $v$ un vèrtex de $G$. Proveu que:  
1) si $G$ és no connex, aleshores $G^c$ és connex;  
2) $(G - v)^c = G^c - v$;  
3) si $G$ és connex i $v$ és un vèrtex de tall de $G$, aleshores $v$ no és un vèrtex de tall de $G^c$.`,
    content: `
Aquest exercici es resol utilitzant les conclusions d'un apartat per resoldre el següent.

### 1) Si $G$ és no connex $\\implies G^c$ és connex

Si $G$ és no connex, té com a mínim dos components connexos, $C_1$ i $C_2$. 
*   A $G^c$, qualsevol vèrtex de $C_1$ estarà connectat amb **tots** els vèrtexs de $C_2$ (perquè a $G$ no hi havia cap aresta entre ells).
*   Això permet anar de qualsevol vèrtex $u$ a qualsevol vèrtex $v$ en un màxim de 2 passos (si $u, v$ són del mateix component, pots anar de $u \\to (\\text{node de l'altre component}) \\to v$).
*   Per tant, $G^c$ sempre és connex.

### 2) Identitat del complementari: $(G - v)^c = G^c - v$

Aquesta és una propietat d'estructures de conjunts molt intuïtiva:
*   $(G - v)^c$: Primer eliminem el vèrtex $v$ (i les seves arestes) i després invertim la resta del graf.
*   $G^c - v$: Primer invertim tot el graf i després eliminem el vèrtex $v$.
En ambdós casos, el conjunt de vèrtexs resultants és $V \\setminus \{v\}$ i el conjunt d'arestes és el mateix: totes les parelles de vèrtexs restants que NO tenien aresta al graf original.

### 3) El vèrtex de tall al complementari

Ara combinem els dos resultats anteriors per demostrar que si $v$ és de tall a $G$, no ho pot ser a $G^c$:

1.  Si $v$ és un **vèrtex de tall** de $G$, per definició el graf restant **$G - v$ és no connex**.
2.  Pel punt **(1)**, sabem que si un graf és no connex, el seu complementari és connex. Per tant, **$(G - v)^c$ és connex**.
3.  Pel punt **(2)**, sabem que $(G - v)^c$ és exactament el mateix que **$G^c - v$**.
4.  Així doncs, hem demostrat que **$G^c - v$ és connex**.
5.  Com que treure el vèrtex $v$ del graf $G^c$ **no** l'ha desconnectat, $v$ **no pot ser un vèrtex de tall** de $G^c$. $\square$
  `,
    availableLanguages: ['ca']
};
