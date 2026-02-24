import type { Solution } from '../../solutions';

export const ex1_16: Solution = {
    id: 'M1-T1-Ex1.16',
    title: 'Exercici 1.16: Regularitat i Paritat',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Demostreu que si un graf és regular de grau senar, aleshores té ordre parell.`,
    content: `
Sigui $G$ un graf $r$-regular d'ordre $n$.
Sabem pel **Lema de les Encaixades** que:
$$
\\sum_{v \\in V} \g(v) = 2m
$$
Com que és $r$-regular, la suma de graus és $n \\cdot r$.
$$
n \\cdot r = 2m
$$
El costat dret ($2m$) és sempre un nombre **parell**.
Per tant, el costat esquerre ($n \\cdot r$) ha de ser **parell**.

Si $r$ (el grau) és **senar**, l'única manera que el producte $n \\cdot r$ sigui parell és que $n$ (l'ordre) sigui **parell**.
*(Perquè Senar $\\times$ Senar = Senar. Només Parell $\\times$ Senar = Parell).*

**Q.E.D.**
        `,
    availableLanguages: ['ca']
};
