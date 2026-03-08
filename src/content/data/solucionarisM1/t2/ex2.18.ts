import type { Solution } from '../../solutions';

export const ex2_18: Solution = {
    id: 'M1-T2-Ex2.18',
    title: 'Exercici 2.18: Diàmetre Mínim per Densitat Alta',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Sigui $G$ un graf d'ordre $1001$ tal que cada vèrtex té grau $\\ge 500$. Demostreu que $G$ té diàmetre $\\le 2$.`,
    content: `
Ho demostrarem visualment per **reducció a l'absurd**:

Suposem l'invers: el graf **SÍ** que té un diàmetre més gran de 2 (és a dir, $D(G) \\ge 3$).
Això vol dir que existeixen forçosament dos vèrtexs, diguem-ne $u$ i $v$, separats per una distància mínima de 3 salts ($dist(u,v) \\ge 3$).

Si estan separats per almenys 3 salts, això implica que:
1. Ells dos **no estan connectats directament** (si no, la distància seria 1).
2. **No tenen cap veí en comú**. Si tinguessin algun veí compartit $x$, el camí podria ser $u \\to x \\to v$, fent que la distància fos exactament 2 (o menys), cosa que trencaria la nostra suposició inicial de $\\ge 3$.

Per tant, els conjunts de veïns de cadascun **són 100% disjunts o barrejats** (se separats en dos blocs impermeables).

Fem el recompte matemàtic de quants vèrtexs necessitem per viure amb aquesta realitat al mapa:
*   El propi node central **$u$** (= 1 vèrtex)
*   Els amics lligats a $u$ (com el seu grau és $\\ge 500$, hi ha **$\\ge 500$** vèrtexs aquí)
*   El propi node aliè oposat **$v$** (= 1 vèrtex)
*   Els amics de l'altre costat de $v$ (totalment aliens als de l'$u$: sumen **$\\ge 500$** vèrtexs més)

Suma numèrica exigida mínima de presència operativa sobre el tauler:
$$ \\text{Vèrtexs Requerits} \\ge 1 + 500 + 1 + 500 = 1002 $$

**Contradicció!**
Tot i calcular el repàs base mínim, matemàticament ja ens surt que necessitàvem 1002 nodes actius en conjunt al sistema per acollir la situació de $\\ge 3$ salts per separar les poblacions asimètriques...
Però l'enunciat ens diu fixament de factor definit que **$ordre(G) = 1001$**.
És físicament impossible entaforar $1002$ personatges de joc operatius vius en un món de només capacitat límit fitats en $1001$.

Com que la presumpció inicial acaba estavellant l'exercici:
La solució lògica imposa que mai ningú no haurà de saltar un límit topall $\\ge 3$ salts. Conseqüentment, res triga tant com 3.
El Diàmetre ha de ser complert en temps finit: $D(G) \\le 2$. $\\square$
  `,
    availableLanguages: ['ca']
};
