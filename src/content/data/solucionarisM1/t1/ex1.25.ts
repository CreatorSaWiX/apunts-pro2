import type { Solution } from '../../solutions';

export const ex1_25: Solution = {
  id: 'M1-T1-Ex1.25',
  title: 'Exercici 1.25: Comptants Grafs No Isomorfs',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Determineu el nombre de grafs no isomorfs d'ordre 20 i mida 188.`,
  content: `
Volem calcular grafs amb $n=20$ i $m=188$. Cercar configuracions amb tantes arestes és molt costós combinatòriament.

Utilitzarem la propietat demostrada a l'**Ex 1.24**: _Diferenciar classes d'isomorfia a la base equival a fer-ho en el seu complementari_.

1. **Mida màxima ($K_{20}$):**
$ m_{K_{20}} = \\frac{20 \\cdot 19}{2} = 190 \\text{ arestes} $

2. **Càlcul per al graf complementari $G^c$:**
$ m(G^c) = 190 - 188 = 2 \\text{ arestes} $

L'enunciat es redueix ara a una qüestió senzilla: _Quants grafs no isomorfs hi ha d'ordre 20 i mida 2?_
Recordant l'exercici 1.21 on analitzàvem 2 arestes en un ordre obert, només ens poden aparèixer dues estructures autònomes i dissociades independentment del nombre de vèrtexs aïllats en total:
*   Ambdós arestes compartint 1 vèrtex: **$P_3 \\cup 17K_1$**
*   Les arestes es troben aïllades respecte elles: **$2K_2 \\cup 16K_1$**

**Resposta:**
Només hi ha **2** grafs no isomorfs.
`,
  availableLanguages: ['ca']
};
